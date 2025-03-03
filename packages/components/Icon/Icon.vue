<script setup lang="ts">
import { type IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";
import { computed } from "vue";

defineOptions({
  name: "YaqueIcon",
  inheritAttrs: false,
});

const props = defineProps<IconProps>();

const filterProps = computed(() => omit(props, ["type", "color"])); // 过滤掉type和color属性
const customStyles = computed(() => ({ color: props.color ?? void 0 })); // 自定义样式
</script>

<template>
  <i
    class="yaque-icon"
    :class="{ [`yaque-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="{ ...filterProps, icon: props.icon }" />
  </i>
</template>

<style>
@import "./style.css";
</style>
