<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <v-card
    >
      <v-container>
        <v-row align="center" justify="start">
          <v-col
              v-for="user in selectUsers"
              :key="user.uuid"
              class="py-1 pe-0"
              cols="auto"
          >
            <v-chip
                :disabled="loading"
                closable
                @click:close="deleteUser(user.uuid)"
            >
              {{ fieldName(user) }}
            </v-chip>
          </v-col>

          <v-col v-if="!allSelected" cols="12">
            <v-text-field
              ref="searchField"
              v-model="search"
              label="Поиск"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider v-if="!allSelected"></v-divider>
        <v-row>
          <v-col cols="12" md="12">
            <v-list v-if="users.length > 0">
              <template v-for="user in users" :key="user.uuid">
                <v-list-item
                    :disabled="loading"
                    @click="registrationUser(user.uuid)"
                >
                  <v-list-item-title v-text="fieldName(user)"/>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import M from "materialize-css";

export default {
  name: "UserObjectAddForm",
  props: {
    uuidObject: null
  },
  data: () => ({
    dialog: false,
    users: [],
    selectUsers: [],
    loading: false,
    search: '',
    selected: [],
  }),
  computed: {
    allSelected() {
      return this.selected.length === 5
    },
  },

  watch: {
    selected() {
      this.search = ''
    },
    search(){
      axios
          .get('/user/search', {params: {
            search_field: this.search
          }})
          .then((response) => {
            this.users = response.data
          })
    }
  },

  methods: {
    open(){
      this.getUserList()
      this.$nextTick(()=>{
        this.dialog = true
      })
    },

    registrationUser(uuid){
      axios
          .post(`/object/${this.uuidObject}/user/${uuid}`)
          .then((response) => {
            M.toast({html: response.data.message})
            this.getUserList()
          })
    },

    deleteUser(uuid){
      axios
          .delete(`/object/${this.uuidObject}/user/${uuid}`)
          .then((response) => {
            M.toast({html: response.data.message})
            this.getUserList()
          })
    },

    getUserList(){
      axios
          .get(`/object/${this.uuidObject}/users`)
          .then((response) => {
            this.selectUsers = response.data
          })
    },

    fieldName(user){
      return `${user.surname} ${user.name[0]}. ${user.patronymic[0]}.`
    }
  }
}
</script>

<style scoped>

</style>