<script setup lang="ts">
import { ref, computed, inject } from "vue";
import type { ButtonProps, ButtonEmits, ButtonInstance } from "./types";
import { throttle } from "lodash-es";
import { BUTTON_GROUP_CTX_KEY } from "./constants";
import YaqueIcon from "../Icon/Icon.vue";
// 组件名称
defineOptions({
  name: "YaqueButton",
});

const emits = defineEmits<ButtonEmits>();
// 定义 props 和默认值
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: true,
  throttleDuration: 1000,
});
// 定义按钮组的上下文
const buttonGroupCtx = inject(BUTTON_GROUP_CTX_KEY, void 0);

const slots = defineSlots();

// 使用 ref 来引用按钮元素
const _ref = ref<HTMLButtonElement>();
const size = computed(() => buttonGroupCtx?.size ?? props.size ?? "");
const type = computed(() => buttonGroupCtx?.type ?? props.type ?? "");
const disabled = computed(
  () => props.disabled || buttonGroupCtx?.disabled || false
);
const iconStyle = computed(() => {
  marginRight: slots.default ? "6px" : "0px";
});

const handeleBtnClick = (e: MouseEvent) => {
  emits("click", e);
};
const handeleBtnClickThrottle = throttle(
  handeleBtnClick,
  props.throttleDuration
);

defineExpose<ButtonInstance>({
  ref: _ref,
  disabled,
  size,
  type,
});
</script>

<template>
  <component
    :is="tag"
    :ref="_ref"
    class="yaque-button"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`yaque-button--${type}`]: type,
      [`yaque-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-loading': loading,
      'is-disabled': disabled,
    }"
    @click="(e:MouseEvent)=> useThrottle ? handeleBtnClickThrottle(e) : handeleBtnClick(e)"
  >
    <template v-if="loading">
      <slot name="loading">
        <yaque-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          :style="iconStyle"
          size="1x"
          spin
        />
      </slot>
    </template>
    <yaque-icon
      :icon="icon"
      size="1x"
      :style="iconStyle"
      v-if="icon && !loading"
    />
    <slot></slot>
  </component>
</template>
<style scoped>
@import "./styles.css";
</style>
