# vue-image-cropper

a vue image cropper plugin

# API

## Attributes

<table>
    <thead>
        <tr>
            <th>属性名</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>width</td>
            <td>组件宽度</td>
            <td>number</td>
            <td>472</td>
        </tr>
        <tr>
            <td>height</td>
            <td>组件高度</td>
            <td>number</td>
            <td>238</td>
        </tr>
        <tr>
            <td>cutAreaRadius</td>
            <td>圆形裁剪区域半径</td>
            <td>number</td>
            <td>75</td>
        </tr>
    </tbody>
</table>

## Slots

<table>
    <thead>
        <tr>
            <th>插槽名</th>
            <th>说明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>tip</td>
            <td>裁剪框提示内容</td>
        </tr>
    </tbody>
</table>

## Exposes

<table>
    <thead>
        <tr>
            <th>名称</th>
            <th>说明</th>
            <th>类型</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>save</td>
            <td>使用浏览器下载图片</td>
            <td>() => Promise&lt;void&gt;</td>
        </tr>
        <tr>
            <td>getBlob</td>
            <td>获取裁剪区域blob对象</td>
            <td>() => Promise&lt;Blob&gt; | undefined</td>
        </tr>
        <tr>
            <td>reset</td>
            <td>重置</td>
            <td>() => void</td>
        </tr>
    </tbody>
</table>

# Installation

1. git clone git@github.com:manshen666/vue-image-cropper.git
2. cd vue-image-cropper
3. pnpm install
4. pnpm run dev

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid black;
}

td {
  padding: 12px;
  border-bottom: 1px solid black;
}
</style>
