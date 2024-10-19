<script>
import UserService from "@/store/user.service";

export default {
  name: 'ProfessionalTable',
  data(){
    return{
      headers: [
        { title: 'id', align: 'start', sortable: false, key: 'id',  value: item => {
            return item.id
          }
        },
        { title: 'Системное имя', key: 'name', align: 'start', value: item => {
            return item.name
          }
        },
        { title: 'Название', key: 'description', align: 'start', value: item => `${item.description}` },
        { title: 'Действия', key: "actions", align: 'center' }
      ],
      profession: [],
      loading: true,
    }
  },
  methods: {
    loadItem() {
      this.loading = true

      UserService.getProfUser().then(
          profs => {
            this.profession = profs
            console.log(this.profession)
            this.loading = false
          })
    },
    deleteProf(uuid){
      this.$emit("deleteProf", uuid)
    },
  },
  mounted() {
    this.loadItem()
  }

}

</script>

<template>
  <v-card
      title="Должности"
      flat
  >
    <v-data-table-virtual
        :headers="headers"
        :items="profession"
        item-value="id"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
            class="me-2"
            size="small"
            @click="deleteProf(item.id)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<style scoped>

</style>