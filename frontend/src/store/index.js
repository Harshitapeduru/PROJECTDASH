// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    salesData: [],
    selectedCategory: null,
    summary: {
      rows: 0,
      columns: 0
    }
  },
  mutations: {
    SET_SALES_DATA(state, data) {
      state.salesData = data;
    },
    SET_SELECTED_CATEGORY(state, category) {
      state.selectedCategory = category;
    },
    SET_SUMMARY(state, summary) {
      state.summary = summary;
    },
    UPDATE_SALE(state, newSale) {
      const index = state.salesData.findIndex(sale => sale.id === newSale.id);
      if (index !== -1) {
        state.salesData.splice(index, 1, newSale);
      } else {
        state.salesData.push(newSale);
      }
    }
  },
  getters: {
    filteredData: (state) => {
      if (!state.selectedCategory) return state.salesData;
      return state.salesData.filter(item => item.category === state.selectedCategory);
    },
    categoryTotals: (state) => {
      const categories = {};
      state.salesData.forEach(item => {
        if (!categories[item.category]) {
          categories[item.category] = 0;
        }
        categories[item.category] += item.total;
      });
      return Object.entries(categories).map(([name, value]) => ({ name, value }));
    },
    summaryStats: (state, getters) => {
      const data = getters.filteredData;
      return {
        totalSales: data.reduce((sum, item) => sum + item.total, 0),
        totalItems: data.reduce((sum, item) => sum + item.quantity, 0),
        categories: new Set(data.map(item => item.category)).size,
        avgSaleValue: data.length ? Math.round(data.reduce((sum, item) => sum + item.total, 0) / data.length) : 0
      };
    }
  },
  actions: {
    async fetchData({ commit }) {
      try {
        const [dataRes, summaryRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/data'),
          fetch('http://127.0.0.1:5000/api/summary')
        ]);
        const data = await dataRes.json();
        const summary = await summaryRes.json();
        commit('SET_SALES_DATA', data);
        commit('SET_SUMMARY', summary);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    selectCategory({ commit }, category) {
      commit('SET_SELECTED_CATEGORY', category);
    }
  }
});

// src/components/DashboardView.vue
<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">Last updated: {{ currentTime }}</span>
          <button 
            v-if="selectedCategory"
            @click="clearFilter"
            class="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Clear Filter
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(stat, index) in summaryCards" :key="index" 
             class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-sm text-gray-600">{{ stat.title }}</h3>
          <p class="text-2xl font-bold mt-2">{{ stat.value }}</p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Pie Chart -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Sales by Category</h3>
          <PieChart 
            :data="categoryData"
            @category-selected="onCategorySelect"
            :selected-category="selectedCategory"
          />
        </div>

        <!-- Product Bar Chart -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Sales by Product</h3>
          <BarChart :data="filteredData" />
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Sales Data</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th v-for="header in ['Product', 'Category', 'Quantity', 'Price', 'Total', 'Date']" 
                      :key="header"
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="item in filteredData" 
                    :key="item.id"
                    class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{{ item.product }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.category }}</td>
                  <td class="px-4 py-3 text-sm">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm">${{ item.price.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-sm">${{ item.total.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-sm">{{ formatDate(item.date) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import PieChart from './PieChart.vue';
import BarChart from './BarChart.vue';
import io from 'socket.io-client';

export default {
  components: {
    PieChart,
    BarChart
  },
  setup() {
    const store = useStore();
    const currentTime = ref(new Date().toLocaleString());
    const socket = io('http://127.0.0.1:5000');
    
    const timeInterval = setInterval(() => {
      currentTime.value = new Date().toLocaleString();
    }, 1000);

    onMounted(() => {
      store.dispatch('fetchData');
      
      socket.on('sales_update', (newSale) => {
        store.commit('UPDATE_SALE', newSale);
      });
    });

    onUnmounted(() => {
      clearInterval(timeInterval);
      socket.disconnect();
    });

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const summaryCards = computed(() => {
      const stats = store.getters.summaryStats;
      return [
        { title: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}` },
        { title: 'Total Items Sold', value: stats.totalItems.toLocaleString() },
        { title: 'Categories', value: stats.categories },
        { title: 'Avg. Sale Value', value: `$${stats.avgSaleValue.toLocaleString()}` }
      ];
    });

    return {
      currentTime,
      summaryCards,
      formatDate,
      selectedCategory: computed(() => store.state.selectedCategory),
      filteredData: computed(() => store.getters.filteredData),
      categoryData: computed(() => store.getters.categoryTotals),
      onCategorySelect: (category) => store.dispatch('selectCategory', category),
      clearFilter: () => store.dispatch('selectCategory', null)
    };
  }
};
</script>

// src/components/PieChart.vue
<template>
  <div class="relative" style="height: 300px;">
    <apexchart
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
    apexchart: VueApexCharts
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
        type: 'pie',
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const category = props.data[config.dataPointIndex].name;
            emit('category-selected', category);
          }
        }
      },
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }));

    return {
      series,
      chartOptions
    };
  }
};
</script>

// src/components/BarChart.vue
<template>
  <div class="relative" style="height: 300px;">
    <apexchart
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
    apexchart: VueApexCharts
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
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
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
        title: {
          text: 'Sales ($)'
        }
      },
      colors: ['#4F46E5']
    }));

    return {
      series,
      chartOptions
    };
  }
};
</script>