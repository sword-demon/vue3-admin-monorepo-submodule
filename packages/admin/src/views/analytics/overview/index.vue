<template>
  <div class="page-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">数据加载中...</div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <i class="i-ep-document text-3xl" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalArticles }}

</div>
              <div class="stat-label">文章总数</div>
              <div class="stat-trend">
                <span class="trend-up">
                  <i class="i-ep-caret-top" />
                  +{{ statistics.todayArticles }}

                </span>
                <span class="text-xs text-gray-500">今日新增</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              <i class="i-ep-user text-3xl" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalUsers }}

</div>
              <div class="stat-label">用户总数</div>
              <div class="stat-trend">
                <span class="trend-up">
                  <i class="i-ep-caret-top" />
                  +{{ statistics.todayUsers }}

                </span>
                <span class="text-xs text-gray-500">今日新增</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <i class="i-ep-view text-3xl" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(statistics.totalViews) }}

</div>
              <div class="stat-label">总浏览量</div>
              <div class="stat-trend">
                <span class="trend-up">
                  <i class="i-ep-caret-top" />
                  +{{ formatNumber(statistics.todayViews) }}

                </span>
                <span class="text-xs text-gray-500">今日浏览</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <i class="i-ep-chat-dot-round text-3xl" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalComments }}

</div>
              <div class="stat-label">评论总数</div>
              <div class="stat-trend">
                <span class="trend-up">
                  <i class="i-ep-caret-top" />
                  +{{ statistics.todayComments }}

                </span>
                <span class="text-xs text-gray-500">今日评论</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-bold">访问趋势</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button value="7">近7天</el-radio-button>
                <el-radio-button value="30">近30天</el-radio-button>
                <el-radio-button value="90">近90天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div v-if="trendLoading" class="chart-loading">
              <el-icon class="is-loading">
                <i class="i-ep-loading" />
              </el-icon>
              <p class="text-gray-500 mt-4">加载趋势数据中...</p>
            </div>
            <div v-else-if="trendData.length > 0" class="trend-chart">
              <div class="chart-header-info">
                <div class="chart-summary">
                  <div class="summary-item">
                    <span class="summary-label">总浏览量</span>
                    <span class="summary-value">{{ formatNumber(trendData.reduce((sum, item) => sum + item.views, 0)) }}

</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">活跃用户</span>
                    <span class="summary-value">{{ trendData.reduce((sum, item) => sum + item.users, 0) }}

</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">新增文章</span>
                    <span class="summary-value">{{ trendData.reduce((sum, item) => sum + item.articles, 0) }}</span>
                  </div>
                </div>
              </div>
              <div class="simple-chart">
                <div class="chart-bars">
                  <div
                    v-for="item in trendData"
                    :key="item.date"
                    class="chart-bar"
                    :style="{ height: `${(item.views / Math.max(...trendData.map(d => d.views))) * 200}px` }"
                    :title="`${item.date}: ${formatNumber(item.views)} 浏览量`"
                  >
                    <div class="bar-value">{{ formatNumber(item.views) }}

</div>
                  </div>
                </div>
                <div class="chart-labels">
                  <span
                    v-for="item in trendData"
                    :key="item.date"
                    class="chart-label"
                  >
                    {{ item.date.slice(5) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="chart-placeholder">
              <i class="i-ep-data-line text-6xl text-gray-300" />
              <p class="text-gray-500 mt-4">暂无趋势数据</p>
              <el-button type="primary" link class="mt-2" @click="showChartTip">
                查看图表集成建议
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">文章状态分布</span>
          </template>
          <div class="chart-container">
            <div v-if="statistics.totalArticles > 0" class="status-chart">
              <div class="status-item">
                <div
                  class="status-bar"
                  :style="{
                    width: `${(statistics.publishedArticles / statistics.totalArticles) * 100}%`,
                    background: '#67c23a'
                  }"
                />
                <div class="status-info">
                  <span class="status-label">已发布</span>
                  <span class="status-value">{{ statistics.publishedArticles }}

</span>
                  <span class="status-percent">{{ Math.round((statistics.publishedArticles / statistics.totalArticles) * 100) }}%</span>
                </div>
              </div>
              <div class="status-item">
                <div
                  class="status-bar"
                  :style="{
                    width: `${(statistics.draftArticles / statistics.totalArticles) * 100}%`,
                    background: '#909399'
                  }"
                />
                <div class="status-info">
                  <span class="status-label">草稿</span>
                  <span class="status-value">{{ statistics.draftArticles }}

</span>
                  <span class="status-percent">{{ Math.round((statistics.draftArticles / statistics.totalArticles) * 100) }}%</span>
                </div>
              </div>
              <div class="status-item">
                <div
                  class="status-bar"
                  :style="{
                    width: `${(statistics.archivedArticles / statistics.totalArticles) * 100}%`,
                    background: '#e6a23c'
                  }"
                />
                <div class="status-info">
                  <span class="status-label">已归档</span>
                  <span class="status-value">{{ statistics.archivedArticles }}

</span>
                  <span class="status-percent">{{ Math.round((statistics.archivedArticles / statistics.totalArticles) * 100) }}%</span>
                </div>
              </div>
            </div>
            <div v-else class="chart-placeholder">
              <i class="i-ep-pie-chart text-6xl text-gray-300" />
              <p class="text-gray-500 mt-4">暂无文章数据</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据列表 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-bold">热门文章 TOP 10</span>
              <el-link type="primary" :underline="false">
                查看更多
                <i class="i-ep-arrow-right ml-1" />
              </el-link>
            </div>
          </template>
          <el-table
            :data="hotArticles"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column width="50" align="center">
              <template #default="{ $index }">
                <el-tag
                  v-if="$index < 3"
                  :type="$index === 0 ? 'danger' : $index === 1 ? 'warning' : 'success'"
                  size="small"
                >
                  {{ $index + 1 }}

                </el-tag>
                <span v-else class="text-gray-500">{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="article-title">{{ row.title }}

</div>
                <div class="article-meta">
                  <span>{{ row.author }}

</span>
                  <span class="mx-2">·</span>
                  <span>{{ row.categoryName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="120" align="right">
              <template #default="{ row }">
                <div class="flex items-center justify-end gap-3">
                  <div class="stat-item">
                    <i class="i-ep-view text-gray-500" />
                    <span class="text-sm">{{ formatNumber(row.viewCount) }}

</span>
                  </div>
                  <div class="stat-item">
                    <i class="i-ep-star text-gray-500" />
                    <span class="text-sm">{{ row.likeCount }}

</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="font-bold">最新动态</span>
              <el-link type="primary" :underline="false">
                查看更多
                <i class="i-ep-arrow-right ml-1" />
              </el-link>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :timestamp="activity.time"
              placement="top"
              :color="activity.type === 'publish' ? '#67c23a' : activity.type === 'comment' ? '#409eff' : '#909399'"
            >
              <div class="activity-item">
                <div class="activity-icon">
                  <i
                    :class="[
                      activity.type === 'publish' ? 'i-ep-upload' :
                      activity.type === 'comment' ? 'i-ep-chat-dot-round' :
                      'i-ep-edit'
                    ]"
                  />
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ activity.content }}

</div>
                  <div class="activity-user">{{ activity.user }}

</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统状态 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">系统状态</span>
          </template>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="system-status-item">
                <div class="status-icon success">
                  <i class="i-ep-cpu" />
                </div>
                <div class="status-info">
                  <div class="status-title">系统运行时间</div>
                  <div class="status-value">{{ systemStats.uptime }}

</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="system-status-item">
                <div class="status-icon info">
                  <i class="i-ep-timer" />
                </div>
                <div class="status-info">
                  <div class="status-title">平均响应时间</div>
                  <div class="status-value">{{ systemStats.responseTime }}

</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="system-status-item">
                <div class="status-icon warning">
                  <i class="i-ep-warning" />
                </div>
                <div class="status-info">
                  <div class="status-title">错误率</div>
                  <div class="status-value">{{ systemStats.errorRate }}

</div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="system-status-item">
                <div class="status-icon primary">
                  <i class="i-ep-folder-opened" />
                </div>
                <div class="status-info">
                  <div class="status-title">存储使用</div>
                  <div class="status-value">{{ systemStats.storageUsage }}

</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch }

 from 'vue'
import { ElMessageBox }

 from 'element-plus'
import * as contentapi from '@/api/content'
import * as analyticsapi from '@/api/analytics'
import type { Article, ArticleStatistics }

 from '@/types/content'
import type { TrendData, Activity, OverviewStatistics }

 from '@/api/analytics'
import {
  buildMockArticleStatistics,
  buildMockOverviewStatistics,
  buildMockTrendData,
  buildMockHotArticles,
  buildMockActivities,
} from '@/mock-data/analytics'

// 状态
const loading = ref(false)
const trendLoading = ref(false)
const trendPeriod = ref('7')

// 统计数据
const statistics = reactive({
  totalArticles: 0,
  todayArticles: 0,
  totalUsers: 0,
  todayUsers: 0,
  totalViews: 0,
  todayViews: 0,
  totalComments: 0,
  todayComments: 0,
  publishedArticles: 0,
  draftArticles: 0,
  archivedArticles: 0,
})

// 趋势数据
const trendData = ref<TrendData[]>([])

// 热门文章
const hotArticles = ref<Article[]>([])

// 最新动态
const recentActivities = ref<Activity[]>([])

// 系统状态
const systemStats = reactive({
  uptime: '99.9%',
  responseTime: '125ms',
  errorRate: '0.02%',
  storageUsage: '2.3GB / 10GB',
})

const applyArticleStatistics = (articleStats: ArticleStatistics) => {
  statistics.totalArticles = articleStats.totalCount || 0
  statistics.todayArticles = articleStats.todayPublishedCount || 0
  statistics.totalViews = articleStats.totalViewCount || 0
  statistics.totalComments = articleStats.totalCommentCount || 0
  statistics.publishedArticles = articleStats.publishedCount || 0
  statistics.draftArticles = articleStats.draftCount || 0
  statistics.archivedArticles = articleStats.archivedCount || 0
}

const applyoverviewstatistics = (overview: OverviewStatistics) => {
  statistics.totalUsers = overview.users?.total || 0
  statistics.todayUsers = overview.users?.today || 0
  statistics.todayViews = overview.content?.todayViews || 0
  statistics.todayComments = overview.content?.todayComments || 0

  if (overview.system) {
    Object.assign(systemStats, overview.system)
  }
}

/**
 * 格式化数字
 */
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * 显示图表集成提示
 */
const showcharttip = () => {
  ElMessageBox.alert(
    `
      <div style="text-align: left;">
        <h4 style="margin-top: 0;">推荐的图表库:</h4>
        <ul style="padding-left: 20px;">
          <li><strong>ECharts</strong> - 功能强大的可视化库</li>
          <li><strong>Chart.js</strong> - 轻量级图表库</li>
          <li><strong>ApexCharts</strong> - 现代化的交互式图表</li>
        </ul>
        <h4>Vue3 集成示例 (ECharts):</h4>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
pnpm add echarts vue-echarts

// main.ts
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, GridComponent, CanvasRenderer])
app.component('v-chart', ECharts)
        </pre>
      </div>
    `,
    '图表集成建议',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了',
    }
  )
}

/**
 * 获取统计数据
 */
const fetchstatistics = async () => {
  const articleStats = await contentApi.getArticleStatistics().catch(() => null)
  applyArticleStatistics(articleStats ?? buildMockArticleStatistics())

  const overview = await analyticsApi.getOverviewStatistics().catch(() => null)
  applyOverviewStatistics(overview ?? buildMockOverviewStatistics())
}

/**
 * 获取趋势数据
 */
const fetchtrenddata = async () => {
  trendLoading.value = true
  const response = await analyticsApi
    .getTrendData(Number(trendPeriod.value))
    .catch(() => [] as TrendData[])

  trendData.value =
    response && response.length > 0
      ? response
      : buildmocktrenddata(number(trendperiod.value))

  trendloading.value = falsetrueconstresponseawaitanalyticsApi.getTrendDataNumber.catchasTrendDatatrendData.valueresponseresponse.length0response
}

/**
 * 获取热门文章
 */
const fetchhotarticles = async () => {
  const result = await contentApi
    .getArticleList({
      page: 1,;
      pageSize: 50, // 获取更多数据用于排序
    })
    .catch(() => null)

  hotarticles.value =
    result?.list?.length
      ? result.list
          .slice()
          .sort((a, b) => b.viewcount - a.viewcount)
          .slice(0, 10)
      : buildmockhotarticles()
}

/**
 * 获取最新动态
 */
const fetchactivities = async () => {
  const response = await analyticsApi.getActivities(10).catch(() => [] as Activity[])

  recentActivities.value = response.length > 0 ? response : buildmockactivities()responseawaitanalyticsApi.getActivities.catchasActivityrecentActivities.valueresponse.length0response
}

// 监听趋势周期变化 - 添加防抖
let trendTimer: NodeJS.Timeout | null = null
watch(trendPeriod, () => {
  // 清除之前的定时器
  if (trendTimer) {
    clearTimeout(trendTimer)
  }

  // 延迟 300ms 后执行
  trendTimer = setTimeout(() => {
    fetchTrendData()
  }, 300)
})

// 统一的数据获取函数
const fetchAllData = async () => {
  loading.value = true
  try {
    // 并行获取所有数据
    await Promise.all([
      fetchStatistics(),
      fetchHotArticles(),
      fetchTrendData(),
      fetchActivities()
    ])
  } catch (error) {
    console.error('数据获取失败:', error)
  }

 finally {
    loading.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (trendTimer) {
    clearTimeout(trendTimer)
    trendTimer = null
  }
})

// 初始化
onMounted(() => {
  fetchAllData()
})
</script>

<style scoped lang="scss">
.page-container {
  position: relative;
  padding: 20px;
}

// 加载覆盖层
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(255 255 255 / 90%);
  border-radius: 8px;

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #409eff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    color: #606266;
    font-size: 16px;
    margin-top: 20px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }

  100% { transform: rotate(360deg); }
}

// 统计卡片样式
.stat-card {
  border: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  color: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  color: #303133;
  font-size: 28px;
  line-height: 1;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  .trend-up {
    display: flex;
    align-items: center;
    color: #67c23a;
    gap: 2px;
  }
}

// 卡片头部
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 图表容器
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
}

.chart-placeholder {
  color: #909399;
  text-align: center;
}

// 状态图表
.status-chart {
  padding: 20px 0;
}

.status-item {
  margin-bottom: 24px;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }
}

.status-bar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  color: white;
  border-radius: 4px;
  transition: width 0.5s ease;
  font-weight: 500;
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 0 4px;
  gap: 8px;
}

.status-label {
  color: #606266;
  font-size: 14px;
}

.status-value {
  color: #303133;
  font-size: 16px;
  font-weight: bold;
}

.status-percent {
  padding: 2px 6px;
  background: #f5f7fa;
  color: #909399;
  font-size: 12px;
  border-radius: 3px;
}

// 趋势图表
.trend-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-header-info {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.chart-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.summary-item {
  text-align: center;

  .summary-label {
    display: block;
    color: #909399;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .summary-value {
    display: block;
    color: #303133;
    font-size: 18px;
    font-weight: bold;
  }
}

.simple-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  padding: 0 4px;
  margin-bottom: 8px;
}

.chart-bar {
  position: relative;
  margin: 0 2px;
  background: linear-gradient(to top, #409eff, #66b1ff);
  flex: 1;
  border-radius: 2px 2px 0 0;
  min-height: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to top, #337ecc, #5a9fff);
    transform: scaleY(1.05);
  }
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  color: #606266;
  font-size: 10px;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-bar:hover .bar-value {
  opacity: 1;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
}

.chart-label {
  margin: 0 2px;
  color: #909399;
  font-size: 11px;
  text-align: center;
  flex: 1;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;

  .is-loading {
    font-size: 24px;
    animation: rotating 2s linear infinite;
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 文章列表
.article-title {
  color: #303133;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
}

.article-meta {
  color: #909399;
  font-size: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
}

// 动态时间线
.activity-item {
  display: flex;
  gap: 12px;
}

.activity-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  color: #909399;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #303133;
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-user {
  color: #909399;
  font-size: 12px;
}

// 系统状态
.system-status-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f2f5;
    transform: translateY(-2px);
  }
}

.status-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  color: white;
  font-size: 20px;
  border-radius: 50%;
  flex-shrink: 0;

  &.success {
    background: linear-gradient(135deg, #67c23a, #85ce61);
  }

  &.info {
    background: linear-gradient(135deg, #409eff, #66b1ff);
  }

  &.warning {
    background: linear-gradient(135deg, #e6a23c, #ebb563);
  }

  &.primary {
    background: linear-gradient(135deg, #409eff, #66b1ff);
  }
}

.status-info {
  flex: 1;
}

.status-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 4px;
}

.status-value {
  color: #303133;
  font-size: 18px;
  font-weight: bold;
}

// 响应式
@media (max-width: 768px) {
  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 250px;
  }

  .system-status-item {
    margin-bottom: 12px;
  }

  .chart-summary {
    flex-direction: column;
    gap: 12px;
  }

  .chart-bars {
    height: 150px;
  }
}

// 加载状态
.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(255 255 255 / 90%);
  border-radius: 8px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }

  100% { transform: rotate(360deg); }
}

// 加载文本
.loading-text {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 2000;
  display: flex;
  align-items: center;
  padding: 20px 40px;
  background: rgb(0 0 0 / 80%);
  color: white;
  font-size: 16px;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  gap: 12px;
}
</style>
