<template>
  <div class="yaque-collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from "vue";
import type { CollapseProps, CollapseEmits, CollapseItemName } from "./types";
import { each } from "lodash-es";
import { COLLAPSE_CTX_KEY } from "./constants";
import { debugWarn } from "@yaque-element/utils/error";

const COMPONENT_NAME = "YaqueCollapse" as const;
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<CollapseProps>();
const emits = defineEmits<CollapseEmits>();
const activeNames = ref<CollapseItemName[]>(props.modelValue);

// 处理activeNames
if (props.accordion && activeNames.value.length > 1) {
  debugWarn(COMPONENT_NAME, "accordion mode should only have one active item");
}

function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];
  // 手风琴模式
  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }

  const index = _activeNames.indexOf(item);
  if (index > -1) {
    // 存在，删除数组中的一项
    _activeNames.splice(index, 1);
  } else {
    // 不存在，插入对应 name
    _activeNames.push(item);
  }
  updateActiveNames(_activeNames);
}
function updateActiveNames(val: CollapseItemName[]) {
  activeNames.value = val;
  each(["update:modelValue", "change"], (e) =>
    emits(e as "update:modelValue" & "change", val)
  );
}

watch(
  () => props.modelValue,
  (val) => updateActiveNames(val)
);
provide(COLLAPSE_CTX_KEY, {
  handleItemClick,
  activeNames,
});
</script>
<style>
@import "./style.css";
</style>
