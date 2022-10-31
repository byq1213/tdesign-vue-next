import { mount } from '@vue/test-utils';
import { expect, it } from 'vitest';
import { ref } from 'vue';
import { Popup } from '@/src/popup/index.ts';
import { usePrefixClass } from '@/src/hooks/useConfig';

// const POPUPClASS = `.${prefix}-popup`;
const transitionStub = () => ({
  render() {
    return this.$options._renderChildren;
  },
});
const POPUPClASS = `.${usePrefixClass('popup').value}`;
const content = '这里是弹出内容';
const visible = false;
describe('Popup', () => {
  describe(':props', () => {
    it(':attach into div#container', async () => {
      const div = document.createElement('div', {});
      div.setAttribute('id', 'container');
      document.body.appendChild(div);
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
          attach: '#container',
        },
      });
      await wrapper.setProps({
        visible: true,
      });
      expect(div.querySelector(POPUPClASS)).toBeDefined();
    });
    /** 浮层里面的内容 */
    it(':content from props', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
      });

      await wrapper.setProps({
        visible,
        content,
      });
      expect(document.querySelector(`${POPUPClASS}__content`).textContent).toEqual(content);
    });
    /** 触发元素，同 triggerElement */
    it.only(':default ', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          trigger: 'click',
        },
        slots: {
          default: <button id="btn">btn</button>,
          content,
        },
        // global: {
        //   renderStubDefaultSlot: true
        // },
        // stubs: {
        //   Transition: transitionStub(), // 已知 vtu 的bug, 替换transition组件功能
        // },
      });
      await wrapper.setProps({
        visible: true,
        trigger: 'click',
      });
      const btn = wrapper.find('#btn');
      // console.log('body', document.body.innerHTML);
      // expect(document.querySelector(POPUPClASS)).toBeNull();
      await btn.trigger('click');
      console.log('body click', document.body.innerHTML);
      // console.log('document.querySelector(POPUPClASS)', document.querySelector(POPUPClASS));

      // expect(document.querySelector(POPUPClASS).textContent).toEqual(content);
    });
    /** 延时显示或隐藏覆层，[延迟显示的时间，延迟隐藏的时间]，单位：毫秒。如果只有一个时间，则表示显示和隐藏的延迟时间相同。示例 `'300'` 或者 `[200, 200]`。默认为：[250, 150] */
    it.skip(':delay', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
      });

      await wrapper.setProps({
        content,
        // trigger: 'click',
        delay: 2000,
      });
      await wrapper.setProps({
        visible: true,
      });
      const btn = wrapper.find('#btn');
      await btn.trigger('mouseover');
    });

    /** 是否在关闭浮层时销毁浮层 */
    it.skip(':destroyOnClose', () => {
      // hover没实现 先跳过
    });
    /** 是否禁用组件 */
    it(':disabled be true', async () => {
      // const btn = wrapper.find('#btn');
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
      });
      await wrapper.setProps({
        visible: true,
        content,
        trigger: 'click',
      });
      const btn = wrapper.find('#btn');
      btn.element.setAttribute('disabled', true);
      await btn.trigger('click');
      expect(document.body.textContent).toEqual('');
    });
    /** 浮层是否隐藏空内容，默认不隐藏 */
    // it(':hideEmptyPopup', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    /** 浮层类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]` */
    // it(':overlayClassName', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    /** 浮层内容部分类名，示例：'name1 name2 name3' 或 `['name1', 'name2']` 或 `[{ 'name1': true }]` */
    it(':overlayInnerClassName', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });
      const overlayInnerClassName = 'a-custom-class';
      await wrapper.setProps({
        overlayInnerClassName,
        visible,
      });
      expect(document.querySelector(`${POPUPClASS}__content`).className.includes(overlayInnerClassName)).toEqual(true);
    });
    /** 浮层内容部分样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点 */
    it(':overlayInnerStyle', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });

      const overlayInnerStyle = {
        height: '666px',
      };
      await wrapper.setProps({
        overlayInnerStyle,
        visible,
      });
      expect(document.querySelector(`${POPUPClASS}__content`).style.cssText.includes('666px')).toEqual(true);
    });
    /** 浮层样式，第一个参数 `triggerElement` 表示触发元素 DOM 节点，第二个参数 `popupElement` 表示浮层元素 DOM 节点 */
    it.skip(':overlayStyle', async () => {
      // 有bug跳过, 会被覆盖
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });
      const overlayStyle = {
        height: '666px',
      };
      await wrapper.setProps({
        overlayStyle,
        content,
        visible,
      });

      expect(document.body.textContent.includes('666px')).toEqual(true);
    });
    /** 浮层出现位置 */
    const position = 'top';
    it(`:placement be ${position}`, async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });

      await wrapper.setProps({
        content,
        visible,
        placement: 'top',
      });

      // 涉及插件popperjs,先用data属性判断
      expect(document.querySelector(`${POPUPClASS}`).attributes['data-popper-placement'].value).toBe(
        position.replace(/-(left|top)$/, '-start').replace(/-(right|bottom)$/, '-end'),
      );
    });
    /** 是否显示浮层箭头 */
    it(':showArrow be true', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });

      await wrapper.setProps({
        content,
        visible,
        showArrow: true,
      });
      expect(document.querySelector(`${POPUPClASS}__content`).className.includes('content--arrow')).toEqual(true); // <div class="t-popup__content t-popup__content--arrow">这
    });
    /** 触发浮层出现的方式 */
    it(':trigger is click', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });
      await wrapper.setProps({
        content,
        trigger: 'click',
      });
      const btn = wrapper.find('#btn');
      expect(document.querySelector(POPUPClASS)).toBeNull();
      await btn.trigger('click');
      expect(document.querySelector(POPUPClASS)).toBeDefined();
    });
    /** 触发元素 */
    it(':triggerElement', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });
      await wrapper.setProps({
        content,
        trigger: 'click',
      });
      const btn = wrapper.find('#btn');
      expect(document.querySelector(POPUPClASS)).toBeNull();
      await btn.trigger('click');
      expect(document.querySelector(POPUPClASS)).toBeDefined();
    });
    /** 是否显示浮层 */
    // it(':visible', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    /** 是否显示浮层，非受控属性 */
    // it(':defaultVisible', ()=>{
    //   const wrapper = mount({
    //     render(){
    //       let content = '这里是弹出内容'
    //       return <Popup content={content} trigger='click'>
    //         <Button variant="outline" id='btn'>触发</Button>
    //         <template slot='content'>{content}</template>
    //       </Popup>
    //     }
    //   })
    // })
    /** 组件层级，Web 侧样式默认为 5500，移动端和小程序样式默认为 1500 */
    it(':zIndex', async () => {
      const wrapper = await mount(Popup, {
        props: {
          visible: false,
          content,
        },
        slots: {
          default: '<button id="btn">btn</button>',
        },
      });
      const zIndex = 1213;
      await wrapper.setProps({
        zIndex,
        visible,
      });
      expect(document.querySelector(`${POPUPClASS}`).style.cssText.includes(zIndex)).toEqual(true);
    });
  });
  describe('@event', () => {
    /** 下拉选项滚动事件 */
    it('onScroll', () => {});
    /** 当浮层隐藏或显示时触发，`trigger=document` 表示点击非浮层元素触发；`trigger=context-menu` 表示右击触发 */
    it('onVisibleChange', () => {});
  });
});
