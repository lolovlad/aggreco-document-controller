<script>
import moment from "moment";
import ClaimService from "@/store/claim.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import {auth as $store} from "@/store/auth.model";
import EditButton from "@/components/UI/Buttons/EditButton.vue";
import SendForwardButton from "@/components/UI/Buttons/SendForwardButton.vue";
import SendBackButton from "@/components/UI/Buttons/SendBackButton.vue";
import InformationButton from "@/components/UI/Buttons/InformationButton.vue";

export default {
  name: "ClaimTable",
  components: {InformationButton, SendBackButton, SendForwardButton, EditButton, DeleteButton},
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

      typeUser: $store.state.user.type.name,
    }
  },
  methods: {
    saveState(){
      this.$store.dispatch('page/saveState', {name: "claim", page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
    deleteClaim(item){
      this.saveState()
      this.$emit("delete", item.uuid)
    },
    editClaim(item){
      this.saveState()
      this.$emit("edit", item.uuid)
    },
    updateStateClaim(item){
      this.saveState()
      this.$emit("updateStateClaim", item.uuid)
    },
    downgradeStateClaim(item){
      this.saveState()
      this.$emit("downgradeStateClaim", item.uuid)
    },
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length >= 0){
        const initialState = $store.state;
        if(initialState.nameTable === "claim"){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        ClaimService.getPageClaim(page, itemsPerPage).then(
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

    getColor (state) {
      if (state === "Черновик") return 'black'
      else if (state === "На рассмотрении") return 'orange'
      else if (state === "На доработку") return 'red'
      else return 'green'
    },
    isForwardBackUser(item){
      if(this.typeUser === "user"){
        let dateNew = new Date(item.datetime)
        let now = new Date();
        let diffHours = (now - dateNew) / (1000 * 60 * 60)
        if(item.state_claim.name === 'under_consideration' && diffHours < 24)
          return true
        return false

      }else{
        return item.state_claim.name !== 'accepted'
      }
    }
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
          {value: 20, title: '20'},
          {value: 40, title: '40'},
          {value: 100, title: '100'}
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
        <edit-button @click="editClaim(item)"/>
        <send-forward-button
            v-if="item.state_claim.name !== 'accepted'"
            @click="updateStateClaim(item)"
            :type-user="typeUser"
        />
        <send-back-button
            v-if="(isForwardBackUser(item)) && item.state_claim.name !== 'accepted' && item.state_claim.name !== 'under_development'"
            @click="downgradeStateClaim(item)"
            :type-user="typeUser"
        />
        <information-button @click="$router.push(`/claim/${item.uuid}`)"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>