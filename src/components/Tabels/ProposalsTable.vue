<script>
import DeleteButton from "@/components/UI/Buttons/DeleteButton.vue";
import InformationProposalButton from "@/components/UI/Buttons/InformationProposalButton.vue";
import ApproveButton from "@/components/UI/Buttons/ApproveButton.vue";
import RejectButton from "@/components/UI/Buttons/RejectButton.vue";
import {auth as $store} from "@/store/auth.model";
import ProposalsService from "@/store/proposals.service";

export default {
  name: "ProposalsTable",
  components: {InformationProposalButton, DeleteButton, ApproveButton, RejectButton},
  data(){
    return{
      headers: [
        { title: '№', key: 'index', sortable: false },
        { title: 'Название', key: 'name', sortable: false, value: item => item.name },
        { title: 'Предложение', key: 'offer', sortable: false, value: item => {
            const shortOffer = item.offer.length > 50 ? item.offer.slice(0, 50) + "..." : item.offer;
            return shortOffer
          }
        },
        { title: 'Комментарий', key: 'comment', sortable: false, value: item => {
            const shortComment = item.comment.length > 50 ? item.comment.slice(0, 50) + "..." : item.comment;
            return shortComment
          }
        },
        { title: 'Объект', key: 'object', sortable: false, value: item => item.object.name },
        { title: 'Работник', key: 'user', sortable: false, value: item => {
            let user = item.user
            return `${user.surname} ${user.name[0]}. ${user.patronymic[0]}.`
          }
        },
        { title: 'Инженер', key: 'expert', sortable: false, value: item => {
            let expert = item.expert
            if(item.expert)
              return `${expert.surname} ${expert.name[0]}. ${expert.patronymic[0]}.`
            else
              return "-"
          }
        },
        { title: 'Статус', key: 'status', sortable: false },
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
      selectState: 0,
      selectDateFrom: null,
      selectDateTo: null
    }
  },
  methods: {
    saveState(){
      this.$store.dispatch('page/saveState', {name: "proposal", page: this.pageNow, perItemPage: this.itemsPerPageNow})
    },
    deleteProposal(item){
      this.saveState()
      this.$emit("delete", item.uuid)
    },
    editProposal(item){
      this.saveState()
      this.$emit("edit", item.uuid)
    },
    updateSearchProposal(selectObject, selectState){
      this.selectObject = selectObject
      this.selectState = selectState
      this.loadItem(1)
    },
    loadItem({page=1, itemsPerPage=20}){
      this.loading = true
      if(this.search.length >= 0){
        const initialState = $store.state;
        if(initialState.nameTable === "proposal"){
          page = initialState.pageNow
          itemsPerPage = initialState.perItemPage
          this.$store.dispatch('page/dropState')
        }
        ProposalsService.getPage(page, itemsPerPage, this.selectState, this.selectObject).then(
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
    getStatusColor(stateClaim){
      const stateTitle = stateClaim.name
      if (stateTitle === 'under_consideration') return 'orange'
      if (stateTitle === 'На доработку' || stateTitle === 'under_development') return 'red'
      return 'green'
    },
    getStatusText(stateClaim){
      const stateTitle = stateClaim.name
      if (stateTitle === 'under_consideration') return 'На рассмотрении'
      if (stateTitle === 'under_development') return 'Отклонено'
      return 'Принято'
    },
    isUser(item){
      if(this.typeUser === "user"){
        if(item.state_claim.name === 'draft'){
          return true
        }else{
          return false
        }
      }else{
        return true
      }
    },
    isAdmin(){
      return this.typeUser === "admin" || this.typeUser === "super_admin"
    },
    approveProposal(item, comment){
      this.saveState()
      this.$emit("approve", item.uuid, comment)
    },
    rejectProposal(item, comment){
      this.saveState()
      this.$emit("reject", item.uuid, comment)
    }
  }
}
</script>

<template>
  <v-card
      title="Технические предложения"
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
      <template v-slot:[`item.index`]="{ index }">
        {{ (page - 1) * itemsPerPage + index + 1 }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.state_claim)" size="small" text-color="white">
          {{ getStatusText(item.state_claim) }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <template v-if="isAdmin()">
          <approve-button
              :state-claim="item.state_claim.name"
              :disabled="item.state_claim.name === 'accepted' || item.state_claim.name === 'under_development'"
              @approve="approveProposal(item, $event)"
          />
          <reject-button
              :state-claim="item.state_claim.name"
              :disabled="item.state_claim.name === 'accepted' || item.state_claim.name === 'under_development'"
              @reject="rejectProposal(item, $event)"
          />
        </template>
        <delete-button @agree="deleteProposal(item)" v-if="isUser(item)"/>
        <information-proposal-button :uuid-proposal="item.uuid"/>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>