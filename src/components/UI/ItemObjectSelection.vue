<script>

import ObjectService from "@/store/object.service";

export default {
  name: "ItemObjectSelection",
  props: {
    uuidObject: {
      type: String
    },
    modelValue: {
      type: [Object, Array, Number, String],
      default: null
    },
    readonly: {
      type: Boolean,
    },
    textBtn: {
      type: String,
      default: "Выбрать оборудованние"
    },
    single: {
      type: Boolean,
      default: false
    },
    returnId: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    equipment: [],

    loading: false,
    search: '',
    selected: [],

    content: {},
    headers: [
      { title: 'Название', align: 'start', sortable: false, key: 'name'},
      { title: 'Номер', align: 'start', sortable: false, key: 'code'},
    ],
    itemsPerPage: 20,
    page: 1,
    totalItems: 0,

  }),
  computed: {
    allSelected() {
      if (this.single) {
        return Object.keys(this.content).length >= 1
      }
      return this.selected.length === 5
    },
    displayValue() {
      if (this.single) {
        const items = Object.values(this.content)
        return items.length > 0 ? items[0] : null
      }
      // В режиме multiple возвращаем массив значений из content
      return Object.values(this.content)
    }
  },

  watch: {
    search(){
      if (this.uuidObject) {
        if (this.search && this.search.length > 0) {
          ObjectService.searchEquipmentInObject(this.uuidObject, this.search)
              .then(equipment => {
                this.equipment = equipment || []
              })
              .catch(() => {
                this.equipment = []
              })
        } else {
          this.loadItem({page: 1, itemsPerPage: 20})
        }
      }
    },
    modelValue: {
      deep: true,
      immediate: false,
      async handler(newValue, oldValue) {
        // Избегаем бесконечного цикла - не обновляем если content уже соответствует modelValue
        if (this.single) {
          // Обновляем content при изменении modelValue
          if (newValue !== oldValue) {
            this.content = {}
            if (newValue) {
              if (typeof newValue === 'object' && !Array.isArray(newValue) && newValue !== null && newValue.uuid) {
                this.content[newValue.uuid] = newValue
              } else if (typeof newValue === 'string') {
                // Может быть UUID или числовой id в виде строки
                if (/^\d+$/.test(newValue)) {
                  // Числовой id в виде строки
                  if (this.equipment.length === 0 && this.uuidObject) {
                    await this.loadItem({page: 1, itemsPerPage: 100})
                  }
                  await this.findEquipmentByValue(newValue, null)
                } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newValue)) {
                  // Это UUID - ищем по UUID
                  if (this.equipment.length === 0 && this.uuidObject) {
                    await this.loadItem({page: 1, itemsPerPage: 100})
                  }
                  await this.findEquipmentByValue(null, newValue)
                }
              } else if (typeof newValue === 'number') {
                // Числовой id
                if (this.equipment.length === 0 && this.uuidObject) {
                  await this.loadItem({page: 1, itemsPerPage: 100})
                }
                await this.findEquipmentByValue(newValue.toString(), null)
              }
            }
          }
        } else {
          // Множественный режим - обновляем только если изменилось
          const currentKeys = Object.keys(this.content).sort().join(',')
          let newKeys = ''
          
          if (Array.isArray(newValue)) {
            newKeys = newValue.map(item => item?.uuid).filter(Boolean).sort().join(',')
            if (currentKeys !== newKeys) {
              this.content = {}
              newValue.forEach(item => {
                if (item && item.uuid) {
                  this.content[item.uuid] = item
                }
              })
            }
          } else if (newValue && typeof newValue === 'object') {
            // Поддержка формата с объектом {uuid: equipment}
            newKeys = Object.keys(newValue).sort().join(',')
            if (currentKeys !== newKeys) {
              this.content = {}
              Object.keys(newValue).forEach(uuid => {
                if (newValue[uuid] && typeof newValue[uuid] === 'object' && newValue[uuid].uuid) {
                  this.content[uuid] = newValue[uuid]
                }
              })
            }
          } else if (!newValue) {
            // Если modelValue стал null/undefined, очищаем content
            if (Object.keys(this.content).length > 0) {
              this.content = {}
            }
          }
        }
      }
    }
  },

  methods: {

    addEquipment(equipment){
      if (this.single) {
        // В режиме single заменяем существующее оборудование
        this.content = {}
        this.content[equipment.uuid] = equipment
        this.handleInput()
        this.dialog = false
      } else {
        // В режиме multiple добавляем к существующему списку
        this.content[equipment.uuid] = equipment
        this.handleInput()
      }
    },

    deleteEquipment(uuid){
      delete this.content[uuid]
      this.handleInput()
    },
    clearSelection() {
      this.content = {}
      this.handleInput()
    },
    findEquipmentById(id) {
      // Устаревший метод, используем findEquipmentByValue
      return this.findEquipmentByValue(id !== null && id !== undefined ? id.toString() : null, null)
    },
    findEquipmentByValue(idString, uuid) {
      // Ищем equipment по числовому id (в виде строки) или по UUID
      if (this.equipment.length > 0) {
        const found = this.equipment.find(eq => {
          if (uuid) {
            // Ищем по UUID
            return eq.uuid === uuid
          } else if (idString) {
            // Ищем по числовому id (может быть в eq.id или нужно преобразовать)
            // Сначала проверяем, есть ли у equipment поле id
            if (eq.id !== undefined && eq.id !== null) {
              return eq.id.toString() === idString || eq.id === parseInt(idString)
            }
            // Если id нет, но есть uuid - не подходит для поиска по id
            return false
          }
          return false
        })
        if (found && found.uuid) {
          this.content[found.uuid] = found
          return Promise.resolve(found)
        }
      }
      // Если не нашли, загружаем первую страницу и ищем там
      return this.loadItem({page: 1, itemsPerPage: 100}).then(() => {
        const found = this.equipment.find(eq => {
          if (uuid) {
            return eq.uuid === uuid
          } else if (idString) {
            if (eq.id !== undefined && eq.id !== null) {
              return eq.id.toString() === idString || eq.id === parseInt(idString)
            }
            return false
          }
          return false
        })
        if (found && found.uuid) {
          this.content[found.uuid] = found
          return found
        }
        return null
      })
    },

    handleInput(){
      if (this.single) {
        // В режиме single возвращаем один объект или null
        const items = Object.values(this.content)
        if (this.returnId) {
          // Если нужно вернуть id вместо объекта
          const equipment = items.length > 0 ? items[0] : null
          if (equipment) {
            // Возвращаем числовой id, если он есть, иначе UUID (для обратной совместимости)
            const equipmentId = equipment.id !== undefined && equipment.id !== null ? equipment.id : equipment.uuid
            this.$emit("update:modelValue", equipmentId)
          } else {
            this.$emit("update:modelValue", null)
          }
        } else {
          this.$emit("update:modelValue", items.length > 0 ? items[0] : null)
        }
      } else {
        // В режиме multiple возвращаем объект с ключами UUID
        this.$emit("update:modelValue", this.content)
      }
    },
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length === 0){
        return ObjectService.getEquipmentPage(this.uuidObject, page, itemsPerPage)
            .then(response => {
              this.page = page
              this.equipment = response.data || []
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false

              this.pageNow = page
              this.itemsPerPageNow = itemsPerPage
              
              // Если есть выбранное оборудование в режиме single, найти его в списке
              if (this.single && this.modelValue) {
                let searchId = null
                if (typeof this.modelValue === 'number') {
                  searchId = this.modelValue
                } else if (typeof this.modelValue === 'object' && this.modelValue.id) {
                  searchId = this.modelValue.id
                }
                if (searchId) {
                  const found = this.equipment.find(eq => eq.id === searchId)
                  if (found && !this.content[found.uuid]) {
                    this.content[found.uuid] = found
                  }
                }
              }
            })
            .catch(
                (response) => {
                  console.log(response)
                  this.loading = false
                  this.equipment = []
                }
            )
      }else{
        return ObjectService.searchEquipmentInObject(this.uuidObject, this.search).then(
            response => {
              this.equipment = response || []
              this.loading = false
              
              // Если есть выбранное оборудование в режиме single, найти его в результатах поиска
              if (this.single && this.modelValue) {
                let searchId = null
                let searchUuid = null
                if (typeof this.modelValue === 'number') {
                  searchId = this.modelValue.toString()
                } else if (typeof this.modelValue === 'string') {
                  if (/^\d+$/.test(this.modelValue)) {
                    searchId = this.modelValue
                  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.modelValue)) {
                    searchUuid = this.modelValue
                  }
                } else if (typeof this.modelValue === 'object' && this.modelValue && this.modelValue.uuid) {
                  searchUuid = this.modelValue.uuid
                } else if (typeof this.modelValue === 'object' && this.modelValue && this.modelValue.id) {
                  searchId = this.modelValue.id.toString()
                }
                if (searchUuid) {
                  const found = this.equipment.find(eq => eq.uuid === searchUuid)
                  if (found && found.uuid) {
                    this.content[found.uuid] = found
                  }
                } else if (searchId) {
                  const found = this.equipment.find(eq => {
                    return eq.id !== undefined && eq.id !== null && (eq.id.toString() === searchId || eq.id === parseInt(searchId))
                  })
                  if (found && found.uuid) {
                    this.content[found.uuid] = found
                  }
                }
              }
            }
        ).catch(
            (response) => {
              console.log(response)
              this.loading = false
              this.equipment = []
            }
        )
      }
    },
  },
  async mounted() {
    if (this.single) {
      // В режиме single modelValue - это один объект, числовой id, UUID или null
      if (this.modelValue) {
        if (typeof this.modelValue === 'object' && !Array.isArray(this.modelValue) && this.modelValue !== null) {
          // Если это объект equipment
          if (this.modelValue.uuid) {
            this.content[this.modelValue.uuid] = this.modelValue
          } else if (this.modelValue.id) {
            // Если передан только id, нужно найти equipment по id
            if (this.uuidObject) {
              await this.loadItem({page: 1, itemsPerPage: 100})
              await this.findEquipmentByValue(this.modelValue.id.toString(), null)
            }
          }
        } else if (typeof this.modelValue === 'string') {
          // Может быть UUID или числовой id в виде строки
          if (/^\d+$/.test(this.modelValue)) {
            // Числовой id в виде строки
            if (this.uuidObject) {
              await this.loadItem({page: 1, itemsPerPage: 100})
              await this.findEquipmentByValue(this.modelValue, null)
            }
          } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.modelValue)) {
            // Это UUID - ищем по UUID
            if (this.uuidObject) {
              await this.loadItem({page: 1, itemsPerPage: 100})
              await this.findEquipmentByValue(null, this.modelValue)
            }
          }
        } else if (typeof this.modelValue === 'number') {
          // Числовой id
          if (this.uuidObject) {
            await this.loadItem({page: 1, itemsPerPage: 100})
            await this.findEquipmentByValue(this.modelValue.toString(), null)
          }
        }
      } else if (this.uuidObject) {
        // Если нет modelValue, просто загружаем список
        await this.loadItem({page: 1, itemsPerPage: 20})
      }
    } else {
      // В режиме multiple modelValue - это массив
      if (Array.isArray(this.modelValue)) {
        for(let i of this.modelValue){
          if (i && i.uuid) {
            this.content[i.uuid] = i
          }
        }
      } else if (this.modelValue && typeof this.modelValue === 'object') {
        // Поддержка старого формата с объектом
        this.content = { ...this.modelValue }
      }
      if (this.uuidObject) {
        await this.loadItem({page: 1, itemsPerPage: 20})
      }
    }
    
    this.handleInput()
  }
}
</script>

<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="800"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-row align="center" justify="start">
        <v-col cols="auto" v-if="displayValue && (single ? displayValue : displayValue.length > 0)">
          <v-chip-group>
            <v-chip 
                v-if="single && displayValue"
                :key="displayValue.uuid"
                closable
                @click:close="clearSelection"
                :disabled="readonly"
            >
              {{displayValue.name}} {{displayValue.code ? `(${displayValue.code})` : ''}}
            </v-chip>
            <v-chip 
                v-else
                v-for="item in displayValue" 
                :key="item.uuid"
                closable
                @click:close="deleteEquipment(item.uuid)"
                :disabled="readonly"
            >
              {{item.name}} {{item.code ? `(${item.code})` : ''}}
            </v-chip>
          </v-chip-group>
        </v-col>
        <v-col cols="auto">
          <v-btn
              class="text-none font-weight-regular"
              prepend-icon="mdi-engine"
              variant="tonal"
              v-bind="activatorProps"
              :disabled="readonly"
          >{{textBtn}}</v-btn>
        </v-col>
      </v-row>
    </template>
    <v-card>
      <v-container>
        <v-row align="center" justify="start">
          <v-col
              v-if="single && displayValue"
              class="py-1 pe-0"
              cols="auto"
          >
            <v-chip
                :disabled="loading"
                closable
                @click:close="clearSelection"
            >
              {{ displayValue.name }}
            </v-chip>
          </v-col>
          <template v-if="!single">
            <v-col
                v-for="item in Object.values(content)"
                :key="item.uuid"
                class="py-1 pe-0"
                cols="auto"
            >
              <v-chip
                  :disabled="loading"
                  closable
                  @click:close="deleteEquipment(item.uuid)"
              >
                {{ item.name }}
              </v-chip>
            </v-col>
          </template>
          <v-col v-if="!allSelected" cols="12">
            <v-text-field
                ref="searchField"
                v-model="search"
                label="Поиск по названию или коду"
                hide-details
                single-line
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider v-if="!allSelected"></v-divider>
        <v-row>
          <v-col cols="12" md="12">
            <v-data-table-server
                :headers="headers"
                :items="equipment"
                :loading="loading"
                item-value="uuid"
                v-model:items-per-page="itemsPerPage"
                :items-length="totalItems"
                @update:options="loadItem"
                :page="page"

                :items-per-page-options="[
                  {value: 20, title: '20'},
                  {value: 40, title: '40'},
                  {value: 100, title: '100'}
                ]"
                :items-per-page-text="'Количество элементов'"
                :loading-text="'Закгрузка данных'"
                :no-data-text="'Данных не обнаружено'"
                hover
                >
              <template #item="{item}">
                <tr @click="addEquipment(item)" style="cursor: pointer;">
                  <td>{{ item.name }}</td>
                  <td>{{ item.code || 'Нет данных'}}</td>
                </tr>
              </template>
            </v-data-table-server>

            <!--<v-list v-if="equipment.length > 0">
              <template v-for="equip in equipment" :key="equip.uuid">
                <v-list-item
                    :disabled="loading"
                    @click="addEquipment(equip)"
                >
                  <v-list-item-title v-text="`${equip.name} (${equip.code})`"/>

                </v-list-item>
              </template>
            </v-list>-->



          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>