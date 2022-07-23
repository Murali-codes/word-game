<template>
  <div class="home">
    <input type="checkbox" id="checkbox" v-model="checked">\
    <label for="checkbox"> Enter word vertically </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Sorter from '../components/Sorter';
//import DataTable from '../components/data-table.vue'
@Component({
  components: {
//    DataTable
  },
})
export default class Home extends Vue {
  public checked =false;

  public readonly commonModalConfigData = {
    buttons: {
      showOkButton: true,
      showSubmitButton: false,
      showProceedButton: true,
      showConfirmButton: true,
      showCancelButton: true,
      okBtnCss: 'some class',
    },
    Title: 'abc',
    bodyContent: 'some content',
    showCloseIcon: true,
  }
  mounted(){
    const t = [];
    Sorter.sort(t, {});
  }
}


</script>
