<template>
  <div class="grid" ref="gridDiv" @mousedown="statSelection" @mouseup="isMouseDown = false">
    <table>
      <tr v-for="(row, rowIndex) of fields" :key="`row-${rowIndex}`" >
        <td v-for="(field, colIndex) of row" :key="`col-${rowIndex}-${colIndex}`">
          <input 
            type="text" 
            maxlength="1"
            :class="{highlight: field.selected, dimensions:true}"
            v-model="field.value" 
            :ref="`${rowIndex}-${colIndex}`"
            @keyup="keypressed($event.keyCode, rowIndex, colIndex)"
            @mouseover="isMouseDown ? field.selected = true : ''"
            :key="`${rowIndex}-${colIndex}`" 
            :id="`${rowIndex}-${colIndex}`" 
            @input="update(rowIndex, colIndex, $event.data)"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component,  Vue, Prop } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop({required:true, default:false, type:Boolean}) moveVertically;

  public isMouseDown = false;

  public fields = new Array(20).fill('').map((row:string) => new Array(20).fill(row).map((defaultValue:string) => ({value:defaultValue,selected: false})));

  public update(rowIndex:number, columnIndex:number, value:string):void{
    if(!value){
      return;
    }
    const index = this.moveVertically ? `${rowIndex+1}-${columnIndex}`:`${rowIndex}-${columnIndex+1}`;
    (this.$refs as {[key:string]:Vue})[index][0].focus();
  }

  public keypressed(keyCode:number, rowIndex:number, colIndex:number):void{
    if(keyCode === 8 && this.fields[rowIndex][colIndex].value === '' && colIndex > 0){
      const index = this.moveVertically ? `${rowIndex-1}-${colIndex}`:`${rowIndex}-${colIndex-1}`;
      (this.$refs as {[key:string]:Vue})[index][0].focus();
    }
  }

  public selectionStarted():void{
    this.fields.forEach(row => row.forEach(field =>field.selected = false));
    ///some test
    this.isMouseDown = true;
  }
}
</script>
<style scoped>
.highlight{
  border-block-color: red;
}
.dimensions{
    height: 15px;
    text-align: center;
    width: 15px;
}
</style>
