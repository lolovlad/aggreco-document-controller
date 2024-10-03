<script>

import {Bar} from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

import {defineComponent} from "vue";
import ObjectService from "@/store/object.service";
import StatisticService from "@/store/statistic.service";
import ChartjsPluginScrollBar from 'chartjs-plugin-scroll-bar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartjsPluginScrollBar)


export default defineComponent({
  name: "ObjectStatisticPage",
  components: {Bar},
  data(){
    return{
      loading: false,
      tableData: {},

      options: {
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 10,
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        plugins: {
          scrollBar: {enable: true, scrollType: 'Vertical'},
        },
        layout: {
          padding: {
            left: 60,
            right: 50,
            top: 20,
            bottom: 80,
          },
        },
      },

      listObject: [],
      targetObject: null,

      listType: [],

      listFilter: [
        {"name": "Все", "val": "all"},
        {"name": "По типу", "val": "type"}
      ],
      filter: "all",
      typeFilter: null,
    }
  },
  methods: {
    convertTableData(tb) {
      const lables = []
      const dataset = {
        label: "Количество АО",
        backgroundColor: "#c45850",
        data: [],
        minBarLength: 7,
      }
      for (let data of Object.values(tb)) {

        lables.push(data.name)
        dataset.data.push(data.count)

      }
      return {
        labels: lables,
        datasets: [dataset],
      }
    },

    getListObject(){
      ObjectService.getListObject().then(
          data => {
            this.listObject = data
          }
      )
    },
    getListType(){
      StatisticService.getListClassBrake().then(
          list_class => {
            console.log(list_class)
            this.listType = list_class

          }
      )
    },

    getObjectStatistic(typeFilter, param){
      StatisticService.getObjectStatistic(this.targetObject, typeFilter, param).then(
          response => {
            this.tableData = this.convertTableData(response.data.obj)
            this.loading = true
          }
      ).catch(
          (response) => {
            console.log(response)
          }
      )
    },
    searchStatistic(){
      if(this.filter === "all"){
        this.getObjectStatistic("all", "")
      }else if(this.filter === "type"){
        this.getObjectStatistic("type", this.typeFilter)
      }
    }
  },
  mounted() {
    this.getListObject()
    this.getListType()
  }

})
</script>

<template>
  <v-container>
    <v-form @submit.prevent>
      <v-row>
        <v-col cols="12" sm="4">
          <v-select
              label="Объект"
              :items="listObject"
              item-title="name"
              item-value="uuid"
              variant="underlined"
              v-model="targetObject"
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
              label="Тип фильтра"
              :items="listFilter"
              item-title="name"
              item-value="val"
              variant="underlined"
              v-model="filter"
          />
        </v-col>
        <v-col cols="12" sm="4" v-if="filter==='type'">
          <v-select
              label="Тип"
              :items="listType"
              item-title="description"
              item-value="id"
              variant="underlined"
              v-model="typeFilter"
          />
        </v-col>



        <v-col cols="12" sm="2">
          <v-btn class="mt-4" type="submit" @click="searchStatistic">Поиск</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <v-container v-if="loading">
    <v-row>
      <Bar :data="tableData" :options="options" />
    </v-row>
  </v-container>
</template>

<style scoped>

</style>