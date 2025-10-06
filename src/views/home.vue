<template>
  <div class="relative">
    <div class="relative">
      <Swiper
        loop
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        :modules="modules"
        :navigation="{
          nextEl: '.custom-swiper-button-next',
          prevEl: '.custom-swiper-button-prev',
        }"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide v-for="(item, index) in swiperList" :key="index">
          <img :src="item.imgUrl" alt="pic" />
        </SwiperSlide>
      </Swiper>
      <!-- 自定义导航按钮 -->
      <div class="custom-swiper-button-prev">
        <ChevronLeft />
      </div>
      <div class="custom-swiper-button-next">
        <ChevronRight />
      </div>
      <!-- 完全自定义分页器 -->
      <div class="custom-pagination">
        <span
          v-for="(_, index) in swiperList"
          :key="index"
          :class="['custom-pagination-bullet', { active: activeIndex === index }]"
          @click="goToSlide(index)"
        />
      </div>
    </div>
    <div class="flex flex-col items-center">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <h1 class="text-3xl font-bold underline p-4 mt-4">tail</h1>
      <t-button> tbutton </t-button>
    </div>
    <!-- <div>
      <div v-for="(item, index) in 100" :key="index">
        {{ item }}
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineOptions({
  name: 'HomeView',
})

const activeIndex = ref(0)
let swiperInstance: SwiperType | null = null
const swiperList = ref([
  {
    imgUrl: new URL('@/assets/1.jpeg', import.meta.url).href,
  },
  {
    imgUrl: new URL('@/assets/2.jpeg', import.meta.url).href,
  },
  {
    imgUrl: new URL('@/assets/3.jpeg', import.meta.url).href,
  },
  {
    imgUrl: new URL('@/assets/4.jpeg', import.meta.url).href,
  },
])
const modules = [Navigation, Pagination, Autoplay]

const onSwiper = (swiper: SwiperType) => {
  swiperInstance = swiper
}
const onSlideChange = () => {
  if (swiperInstance) {
    activeIndex.value = swiperInstance.realIndex
  }
}
const goToSlide = (index: number) => {
  if (swiperInstance) {
    swiperInstance.slideToLoop(index)
  }
}
</script>

<style scoped>
.custom-swiper-button-prev,
.custom-swiper-button-next {
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
  color: #fff;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.custom-swiper-button-prev {
  left: 10px;
}

.custom-swiper-button-next {
  right: 10px;
}

.custom-pagination {
  z-index: 10;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.custom-pagination-bullet {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-pagination-bullet.active {
  /* width: 30px; */
  background-color: #fff;
  transform: scale(1.3);
}
</style>
