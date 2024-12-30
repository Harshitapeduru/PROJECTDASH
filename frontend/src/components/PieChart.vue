// src/components/PieChart.vue
<template>
  <div class="h-64">
    <apexcharts
      type="pie"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexcharts: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    selectedCategory: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const series = computed(() => props.data.map(item => item.value));
    
    const chartOptions = computed(() => ({
      labels: props.data.map(item => item.name),
      chart: {
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const category = props.data[config.dataPointIndex].name;
            emit('category-selected', category);
          }
        }
      },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
      legend: {
        position: 'bottom'
      },
      states: {
        selected: {
          filter: {
            type: 'darken',
            value: 0.75
          }
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '65%'
          }
        }
      }
    }));

    return {
      series,
      chartOptions
    };
  }
});
</script>

// src/components/BarChart.vue
<template>
  <div class="h-64">
    <apexcharts
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexcharts: VueApexCharts
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const series = computed(() => [{
      name: 'Sales',
      data: props.data.map(item => item.total)
    }]);

    const chartOptions = computed(() => ({
      chart: {
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: props.data.map(item => item.product),
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toLocaleString()}`
        }
      },
      colors: ['#4f46e5'],
      plotOptions: {
        bar: {
          borderRadius: 4
        }
      }
    }));

    return {
      series,
      chartOptions
    };
  }
});
</script>