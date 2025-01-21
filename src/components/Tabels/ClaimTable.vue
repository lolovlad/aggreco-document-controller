<script>
import moment from "moment";
import ClaimService from "@/store/claim.service";
import DeleteButton from "@/components/UI/DeleteButton.vue";

export default {
  name: "ClaimTable",
  components: {DeleteButton},
  data(){
    return{
      headers: [
        { title: 'UUID', key: 'uuid', value: item => `${item.uuid}`},
        { title: 'Время', key: 'datetime', sortable: false, value: item => {
            let dateNew = new Date(item.datetime)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Автор', key: 'user', sortable: false, value: item => {
            let user = item.user
            return `${user.surname} ${user.name} ${user.patronymic}`
          }
        },
        { title: 'Состояние заявки', key: 'state_claim', value: item => {
            return `${item.state_claim.description}`
          }
        },
        {title: 'Действия', key: "actions"}
      ],
      items: [],
      totalItems: 0,
      loading: true,
      search: '',
      itemsPerPage: 20,
    }
  },
  props: {
    isDowngrade: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteClaim(item){
      this.$emit("delete", item.uuid)
    },
    editClaim(item){
      this.$emit("edit", item.uuid)
    },
    updateStateClaim(item){
      this.$emit("updateStateClaim", item.uuid)
    },
    downgradeStateClaim(item){
      this.$emit("downgradeStateClaim", item.uuid)
    },
    loadItem({page}){
      this.loading = true
      if(this.search.length >= 0){
        ClaimService.getPageClaim(page).then(
            response => {
              this.items = response.data
              console.log(this.items, "claim")
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false
            }
        ).catch(
            (response) => {
              console.log(response)
            }
        )
      }else{
        return ''
      }
    },

    getColor (state) {
      if (state === "Черновик") return 'black'
      else if (state === "На рассмотрении") return 'orange'
      else if (state === "На доработку") return 'red'
      else return 'green'
    },
  }
}
</script>

<template>
  <v-card
      title="Заявки аварийных остановок"
      flat
  >
    <!--<template v-slot:text>
      <v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
      ></v-text-field>
    </template>-->
    <v-data-table-server
        :items="items"
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items-length="totalItems"
        :loading="loading"
        item-value="uuid"
        @update:options="loadItem"
        :items-per-page-options="[
          {value: -1, title: '$vuetify.dataFooter.itemsPerPageAll'}
      ]"
        :items-per-page-text="'Количество элементов'"
        :loading-text="'Закгрузка данных'"
        :no-data-text="'Данных не обнаружено'"
    >
      <template v-slot:[`item.state_claim`]="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <delete-button @agree="deleteClaim(item)"/>
        <v-icon
            class="me-2"
            size="small"
            @click="editClaim(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            v-if="item.state_claim.name !== 'accepted'"
            class="me-2"
            size="small"
            @click="updateStateClaim(item)"
        >
          mdi-arrow-up-thin
        </v-icon>
        <v-icon
            v-if="(isDowngrade) && item.state_claim.name !== 'accepted'"
            class="me-2"
            size="small"
            @click="downgradeStateClaim(item)"
        >
          mdi-arrow-down-thin
        </v-icon>

      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>