<template>
  <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
  >
    <v-card>
      <v-toolbar>
        <v-btn
            icon="mdi-close"
            @click="closeForm"
        ></v-btn>

        <v-toolbar-title>{{ isEditMode ? 'Редактирование настроек объекта' : 'Добавление настроек объекта' }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
              text="Сохранить"
              variant="text"
              @click="saveSettings"
              :loading="saving"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Хост базы данных *"
                    variant="underlined"
                    v-model="settings.db_host"
                    :rules="[v => !!v || 'Хост базы данных обязателен']"
                    :disabled="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Порт базы данных *"
                    variant="underlined"
                    type="number"
                    v-model.number="settings.db_port"
                    :rules="portRules"
                    :disabled="loading"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Имя базы данных *"
                    variant="underlined"
                    v-model="settings.db_name"
                    :rules="[v => !!v || 'Имя базы данных обязательно']"
                    :disabled="loading"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Пользователь базы данных *"
                    variant="underlined"
                    v-model="settings.db_user"
                    :rules="[v => !!v || 'Пользователь базы данных обязателен']"
                    :disabled="loading"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Пароль базы данных *"
                    variant="underlined"
                    type="password"
                    v-model="settings.db_password"
                    :rules="[v => !!v || 'Пароль базы данных обязателен']"
                    :disabled="loading"
                />
              </v-col>
            </v-row>

            <!-- CSV файл для режима добавления -->
            <v-row v-if="!isEditMode">
              <v-col cols="12" md="12">
                <v-file-input
                    label="CSV файл с данными keys_id_name *"
                    variant="underlined"
                    v-model="csvFile"
                    accept=".csv"
                    :rules="[v => !!v || 'CSV файл обязателен для создания настроек']"
                    :disabled="loading"
                />
                <small class="text-caption text-medium-emphasis">
                  Формат CSV: Property~Id~Id;Property~Полное имя~FullName<br>
                  Пример: 4397888;СУЭС.Секция_1
                </small>
              </v-col>
            </v-row>

            <!-- Таблица keys_id_name для режима редактирования -->
            <v-row v-if="isEditMode">
              <v-col cols="12" md="12">
                <v-card>
                  <v-card-title>
                    Keys ID Name
                    <v-spacer></v-spacer>
                    <v-btn
                        size="small"
                        prepend-icon="mdi-plus"
                        variant="tonal"
                        @click="addKeyValue"
                    >
                      Добавить
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                        :headers="keysHeaders"
                        :items="keysItems"
                        item-value="key"
                        :items-per-page="-1"
                        hide-default-footer
                    >
                      <template v-slot:[`item.key`]="{ item }">
                        <v-text-field
                            v-model="item.key"
                            variant="underlined"
                            density="compact"
                            hide-details
                            :rules="[v => !!v || 'Ключ обязателен']"
                        />
                      </template>
                      <template v-slot:[`item.orig_name`]="{ item }">
                        <v-text-field
                            v-model="item.orig_name"
                            variant="underlined"
                            density="compact"
                            hide-details
                            :rules="[v => !!v || 'Оригинальное имя обязательно']"
                            label="Оригинальное имя"
                        />
                      </template>
                      <template v-slot:[`item.equipment`]="{ item }">
                        <item-object-selection
                            :model-value="item.equipment_id"
                            :uuid-object="objectUuid"
                            text-btn="Выбрать оборудование"
                            single
                            return-id
                            @update:model-value="(id) => item.equipment_id = id"
                        />
                      </template>
                      <template v-slot:[`item.actions`]="{ index }">
                        <v-icon
                            size="small"
                            @click="deleteKeyValue(index)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12">
                <small class="text-caption text-medium-emphasis">* - Поле обязательное</small>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ObjectService from "@/store/object.service";
import ItemObjectSelection from "@/components/UI/ItemObjectSelection.vue";

export default {
  name: "ObjectSettingsForm",
  components: {
    ItemObjectSelection
  },
  props: {
    objectUuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      saving: false,
      valid: false,
      isEditMode: false,
      settings: {
        db_host: '',
        db_port: 5432,
        db_name: '',
        db_user: '',
        db_password: '',
        keys_id_name: {}
      },
      csvFile: null,
      keysHeaders: [
        { title: 'Ключ (ID)', key: 'key', sortable: false },
        { title: 'Оригинальное имя', key: 'orig_name', sortable: false },
        { title: 'Оборудование', key: 'equipment', sortable: false },
        { title: 'Действия', key: 'actions', sortable: false, align: 'center' }
      ],
      keysItems: [],
      portRules: [
        v => !!v || 'Порт обязателен',
        v => (v >= 1 && v <= 65535) || 'Порт должен быть в диапазоне от 1 до 65535'
      ]
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal && this.objectUuid) {
        this.loadSettings()
      } else if (!newVal) {
        this.resetForm()
      }
    },
    objectUuid(newVal) {
      if (newVal && this.dialog) {
        this.loadSettings()
      }
    }
  },
  methods: {
    async loadSettings() {
      if (!this.objectUuid) {
        return
      }
      this.loading = true
      try {
        const data = await ObjectService.getObjectSettings(this.objectUuid)
        // Проверяем наличие настроек по наличию обязательных полей
        const hasSettings = data && (data.db_host || data.db_name) && data.keys_id_name !== null
        
        if (hasSettings) {
          // Режим редактирования - настройки существуют
          this.isEditMode = true
          this.settings = {
            db_host: data.db_host || '',
            db_port: data.db_port || 5432,
            db_name: data.db_name || '',
            db_user: data.db_user || '',
            db_password: data.db_password || '',
            keys_id_name: data.keys_id_name || {}
          }
          // Преобразуем объект keys_id_name в массив для таблицы
          // Новая структура: { key: { equipment_id, field2, orig_name } }
          this.keysItems = Object.keys(this.settings.keys_id_name).map(key => {
            const value = this.settings.keys_id_name[key]
            // Поддерживаем старый формат {id: "name"} для обратной совместимости
            if (typeof value === 'string') {
              return {
                key: key,
                orig_name: value,
                equipment_id: null,
                field2: null
              }
            }
            // Новый формат с объектом
            // equipment_id может быть числом или UUID строкой
            let equipmentId = value.equipment_id || null
            // Оставляем как есть - может быть число или UUID
            // Компонент ItemObjectSelection сам разберется с форматом
            return {
              key: key,
              orig_name: value.orig_name || '',
              equipment_id: equipmentId,
              field2: value.field2 || null
            }
          })
        } else {
          // Режим добавления - настройки не созданы
          this.isEditMode = false
          this.resetForm()
        }
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error)
        this.$store.dispatch('notification/notify', {
          message: error.response?.data?.message || 'Произошла ошибка при загрузке настроек',
          color: 'error'
        })
        // В случае ошибки оставляем форму в режиме добавления
        this.isEditMode = false
        this.resetForm()
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.settings = {
        db_host: '',
        db_port: 5432,
        db_name: '',
        db_user: '',
        db_password: '',
        keys_id_name: {}
      }
      this.csvFile = null
      this.keysItems = []
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    addKeyValue() {
      this.keysItems.push({
        key: '',
        orig_name: '',
        equipment_id: null,
        field2: null
      })
    },
    deleteKeyValue(index) {
      this.keysItems.splice(index, 1)
    },
    async saveSettings() {
      const valid = await this.$refs.form.validate()
      if (!valid.valid) {
        return
      }

      this.saving = true
      try {
        if (this.isEditMode) {
          // Режим редактирования - PUT запрос
          const updateData = {
            db_host: this.settings.db_host,
            db_port: this.settings.db_port,
            db_name: this.settings.db_name,
            db_user: this.settings.db_user,
            db_password: this.settings.db_password
          }

          // Преобразуем массив keysItems обратно в объект с новой структурой
          const keysObj = {}
          this.keysItems.forEach(item => {
            if (item.key && item.orig_name) {
              // equipment_id может быть числом или UUID - оставляем как есть
              // Бэкенд должен сам разобраться с форматом
              keysObj[item.key.toString().trim()] = {
                equipment_id: item.equipment_id || null,
                field2: item.field2 || null,
                orig_name: item.orig_name.trim()
              }
            }
          })
          // Добавляем keys_id_name только если есть хотя бы одна пара ключ-значение
          if (Object.keys(keysObj).length > 0) {
            updateData.keys_id_name = keysObj
          }

          await ObjectService.updateObjectSettings(this.objectUuid, updateData)
        } else {
          // Режим добавления - POST запрос с FormData
          if (!this.csvFile) {
            this.$store.dispatch('notification/notify', {
              message: 'CSV файл обязателен для создания настроек',
              color: 'error'
            })
            this.saving = false
            return
          }

          const formData = new FormData()
          formData.append('db_host', this.settings.db_host)
          formData.append('db_port', this.settings.db_port.toString())
          formData.append('db_name', this.settings.db_name)
          formData.append('db_user', this.settings.db_user)
          formData.append('db_password', this.settings.db_password)
          formData.append('csv_file', this.csvFile)

          await ObjectService.createObjectSettings(this.objectUuid, formData)
        }

        this.closeForm()
        this.$emit('saved')
      } catch (error) {
        console.error('Ошибка при сохранении настроек:', error)
        const errorMessage = error.response?.data?.message || 'Произошла ошибка при сохранении настроек'
        this.$store.dispatch('notification/notify', {
          message: errorMessage,
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    closeForm() {
      this.dialog = false
      this.resetForm()
    },
    open() {
      this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
