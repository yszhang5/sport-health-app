<template>
  <div class="banner-swiper">
    <van-skeleton v-if="loading" :row="1" :row-height="180" />
    <van-swipe
        v-else-if="banners.length > 0"
        :autoplay="3000"
        indicator-color="#fff"
        :loop="true"
        class="swiper"
    >
      <van-swipe-item v-for="banner in banners" :key="banner.id">
        <div class="banner-item" @click="handleClick(banner)">
          <img :src="banner.image" :alt="banner.title" />
          <div v-if="banner.title" class="banner-title">
            {{ banner.title }}
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
    <van-empty v-else description="暂无轮播内容" />
  </div>
</template>

<script setup lang="ts">
import type { Banner } from '@/api/model'

interface Props {
  banners: Banner[]
  loading?: boolean
}

interface Emits {
  (e: 'banner-click', banner: Banner): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const handleClick = (banner: Banner) => {
  emit('banner-click', banner)
}
</script>

<style scoped lang="scss">
.banner-swiper {
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;

  .swiper {
    height: 180px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .banner-item {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-title {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>