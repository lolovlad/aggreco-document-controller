<script>
import moment from "moment";
import ClaimService from "@/store/claim.service";

export default {
  name: "ClaimTable",
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
      if(this.search.length === 0){
        ClaimService.getPageClaim(page).then(
            response => {
              this.items = response.data
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
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="deleteClaim(item)"
        >
          mdi-delete
        </v-icon>
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