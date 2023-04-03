<template>
  <div>
    <v-row>
      <v-col md="9">
        <div class="chart-container">
          <LineChart :chartdata="chartdata"></LineChart>
        </div>
      </v-col>
      <v-col md="3">
        <v-data-iterator :items="[1]" hide-default-footer>
          <template v-slot:default="props">
            <v-card>
              <v-card-title class="subheading font-weight-bold">Статистика</v-card-title>

              <v-divider></v-divider>
              <v-container>
                <v-radio-group>
                  <v-radio label="За сутки"></v-radio>
                  <v-radio label="За неделю"></v-radio>
                  <v-radio label="За месяц"></v-radio>
                </v-radio-group>
              </v-container>
            </v-card>
          </template>
        </v-data-iterator>
        <v-data-iterator :items="[1]" hide-default-footer>
          <template v-slot:default="props">
            <v-card>
              <v-divider></v-divider>

              <v-container>
                    <v-row>
                      <v-col sm="9">Игр активно:</v-col>
                      <v-col sm="3">11</v-col>
                    </v-row>
                    <v-row>
                      <v-col sm="9" class="pt-0">Онлайн:</v-col>
                      <v-col sm="3" class="pt-0">24</v-col>
                    </v-row>
              </v-container>
            </v-card>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LineChart from "../components/dashboard/LineChart.vue";

export default {
  components: {
    LineChart
  },
  name: "home",
  data() {
    return {
      chartdata: {
        labels: [
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00"
        ],

        datasets: [
          {
            label: "Сыграно игр",
            backgroundColor: "transparent",
            borderColor: "#a0f",
            data: [
              40,
              20,
              12,
              39,
              10,
              40,
              39,
              80,
              40,
              20,
              12,
              11,
              40,
              20,
              12,
              39,
              10,
              40,
              39,
              80,
              40,
              20,
              12,
              11
            ]
          },
          {
            label: "Игроки онлайн",
            backgroundColor: "transparent",
            borderColor: "#5e0",
            data: [
              40,
              20,
              12,
              11,
              40,
              40,
              39,
              80,
              20,
              12,
              39,
              10,
              40,
              20,
              12,
              11,
              40,
              40,
              39,
              80,
              20,
              12,
              39,
              10
            ]
          }
        ]
      }
    };
  }
};
</script>