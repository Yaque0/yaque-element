import type { Meta, StoryObj, ArgTypes } from "@storybook/vue3";
import { fn, within, userEvent, expect } from "@storybook/test";
import { YaqueButton, YaqueButtonGroup } from "yaque-element";

// 定义 Story 类型，继承自 YaqueButton 组件的 Story
type story = StoryObj<typeof YaqueButton> & {
  argTypes: ArgTypes;
};

// 配置 Storybook 元数据
const meta: Meta<typeof YaqueButton> = {
  title: "Example/Button", // 在 Storybook 中显示的标题
  component: YaqueButton, // 绑定的组件
  tags: ["autodocs"], // 标签，用于自动文档生成
  argTypes: {
    // 组件的各种可配置属性，定义了不同的控件类型
    type: {
      control: { type: "select" }, // 使用选择框控制
      options: ["primary", "success", "warning", "danger", "info", ""], // 提供的选项
    },
    size: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    disabled: {
      control: "boolean", // 布尔值控件，用于禁用按钮
    },
    loading: {
      control: "boolean", // 布尔值控件，用于加载中状态
    },
    useThrottle: {
      control: "boolean", // 是否使用节流
    },
    throttleDuration: {
      control: "number", // 设置节流时长
    },
    autofocus: {
      control: "boolean", // 是否自动聚焦
    },
    tag: {
      control: { type: "select" },
      options: ["button", "a", "div"], // 可以选择的 HTML 标签类型
    },
    nativeType: {
      control: { type: "select" },
      options: ["button", "submit", "reset", ""],
    },
    icon: {
      control: { type: "text" }, // 文字图标
    },
    loadingIcon: {
      control: { type: "text" }, // 加载中图标
    },
  },
  args: { onClick: fn() }, // 默认的点击事件函数模拟
};

// 生成一个包含按钮的容器
const container = (val: string) => `
<div style="width: 300px;height: 300px;">
${val}
</div>
`;

// 默认按钮的 Story 配置
export const Default: story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: { type: "text" }, // 控制按钮内容的文本输入
    },
  },
  args: {
    type: "primary", // 默认按钮类型为 primary
    content: "Button", // 默认按钮文本
  },
  render: (args: any) => ({
    components: { YaqueButton },
    setup() {
      return { args };
    },
    // 使用 container 包裹按钮组件
    template: container(
      `<yaque-button v-bind="args">{{args.content}}</yaque-button>`
    ),
  }),
  play: async ({
    canvasElement,
    args,
    step,
  }: {
    canvasElement: HTMLElement;
    args: any;
    step: Function;
  }) => {
    const canvas = within(canvasElement); // 获取到 Canvas 元素
    await step("click button", async () => {
      // 模拟点击按钮
      await userEvent.click(canvas.getByRole("button"));
    });

    // 断言 onClick 函数被调用
    expect(args.onClick).toHaveBeenCalled();
  },
};
export const Circle: story = {
  args: {
    icon: "search",
  },
  render: (args: any) => ({
    components: { YaqueButton },
    setup() {
      return { args };
    },
    template: container(`
      <yaque-button circle v-bind="args"/>
    `),
  }),
  play: async ({
    canvasElement,
    args,
    step,
  }: {
    canvasElement: HTMLElement;
    args: any;
    step: Function;
  }) => {
    const canvas = within(canvasElement);
    await step("click button", async () => {
      await userEvent.click(canvas.getByRole("button"));
    });

    expect(args.onClick).toHaveBeenCalled();
  },
};

Circle.parameters = {};

export const Group: story & { args: { content1: string; content2: string } } = {
  argTypes: {
    groupType: {
      control: { type: "select" },
      options: ["primary", "success", "warning", "danger", "info", ""],
    },
    groupSize: {
      control: { type: "select" },
      options: ["large", "default", "small", ""],
    },
    groupDisabled: {
      control: "boolean",
    },
    content1: {
      control: { type: "text" },
      defaultValue: "Button1",
    },
    content2: {
      control: { type: "text" },
      defaultValue: "Button2",
    },
  },
  args: {
    round: true,
    content1: "Button1",
    content2: "Button2",
  },
  render: (args: any) => ({
    components: { YaqueButton, YaqueButtonGroup },
    setup() {
      return { args };
    },
    template: container(`
       <yaque-button-group :type="args.groupType" :size="args.groupSize" :disabled="args.groupDisabled">
         <yaque-button v-bind="args">{{args.content1}}</yaque-button>
         <yaque-button v-bind="args">{{args.content2}}</yaque-button>
       </yaque-button-group>
    `),
  }),
  play: async ({
    canvasElement,
    args,
    step,
  }: {
    canvasElement: HTMLElement;
    args: any;
    step: Function;
  }) => {
    const canvas = within(canvasElement);
    await step("click btn1", async () => {
      await userEvent.click(canvas.getByText("Button1"));
    });
    await step("click btn2", async () => {
      await userEvent.click(canvas.getByText("Button2"));
    });
    expect(args.onClick).toHaveBeenCalled();
  },
};

export default meta;
