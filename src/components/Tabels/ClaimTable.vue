<script>
import moment from "moment";
import ClaimService from "@/store/claim.service";
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import {auth as $store} from "@/store/auth.model";
import EditButton from "@/components/UI/Buttons/EditButton.vue";
import SendForwardButton from "@/components/UI/Buttons/SendForwardButton.vue";
import SendBackButton from "@/components/UI/Buttons/SendBackButton.vue";
import InformationButton from "@/components/UI/Buttons/InformationButton.vue";
import SearchClaimForm from "@/components/Forms/Search/SearchClaimForm.vue";

export default {
  name: "ClaimTable",
  components: {SearchClaimForm, InformationButton, SendBackButton, SendForwardButton, EditButton, DeleteButton},
  data(){
    return{
      headers: [
        { title: 'Объект', key: 'object', sortable: false, value: item => `${item.accident.object.name}`},
        { title: 'Оборудованние', key: 'equipment', sortable: false, value: item => {
            const eqString = item.accident.damaged_equipment.map(eq => eq.name).join(", ");
            const shortEqString = eqString.length > 50 ? eqString.slice(0, 50) + "..." : eqString;
            return shortEqString
          }
        },
        { title: 'Время', key: 'datetime', sortable: false, value: item => {
            let dateNew = new Date(item.datetime)
            return moment(dateNew).format('DD.MM.YYYY HH:mm')
          }
        },
        { title: 'Автор', key: 'user', sortable: false, value: item => {
            let user = item.user
            return `${user.surname} ${user.name[0]}. ${user.patronymic[0]}.`
          }
        },
        { title: 'Состояние заявки', sortable: false, key: 'state_claim', value: item => {
            return `${item.state_claim.description}`
          }
        },
        {title: 'Действия', sortable: false, key: "actions"}
      ],
      items: [],
      totalItems: 0,
      loading: true,
      search: '',
      itemsPerPage: 20,
      page: 1,

      typeUser: $store.state.user.type.name,

      pageNow: 1,
      itemsPerPageNow: 20,

      selectObject: "all",
      selectState: 0
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
    updateSearchClaim(selectObject, selectState){
      this.selectObject = selectObject
      this.selectState = selectState
      this.loadItem(1)
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
        ClaimService.getPageClaim(page, itemsPerPage, this.selectState, this.selectObject).then(
            response => {
              this.page = page
              this.items = response.data
              this.totalItems = parseInt(response.headers["x-count-page"]) * parseInt(response.headers["x-count-item"])
              this.itemsPerPage = parseInt(response.headers["x-count-item"])
              this.loading = false

              this.pageNow = page
              this.itemsPerPageNow = itemsPerPage
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
    },

    isUser(item){
      if(this.typeUser === "user"){
        if(item.state_claim.name === 'draft' || item.state_claim.name === 'under_development'){
          return true
        }else{
          return false
        }
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
    <template v-slot:text>
      <!--<v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
      ></v-text-field>-->
      <search-claim-form
        @updateSelect="updateSearchClaim"
      />
    </template>
    <v-data-table-server
        :items="items"
        :headers="headers"
        v-model:items-per-page="itemsPerPage"
        :items-length="totalItems"
        :loading="loading"
        item-value="uuid"
        :page="page"
        @update:options="loadItem"
        :items-per-page-options="[
          {value: 20, title: '20'},
          {value: 40, title: '40'},
          {value: 100, title: '100'}
        ]"
        :items-per-page-text="'Количество элементов'"
        :loading-text="'Загрузка данных'"
        :no-data-text="'Данных не обнаружено'"
    >
      <template v-slot:[`item.state_claim`]="{ value }">
        <v-chip :color="getColor(value)">
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <delete-button @agree="deleteClaim(item)" v-if="isUser(item)"/>
        <edit-button @click="editClaim(item)"/>
        <send-forward-button
            v-if="isUser(item)"
            @click="updateStateClaim(item)"
            :type-user="typeUser"
        />
        <send-back-button
            v-if="isForwardBackUser(item)"
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