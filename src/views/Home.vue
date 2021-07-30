<template>
  <div class="home">
    <Grid :move-vertically="checked"/>
    <input type="checkbox" id="checkbox" v-model="checked">
    <label for="checkbox"> Enter word vertically </label>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Grid from '@/components/grid.vue'; // @ is an alias to /src

@Component({
  components: {
    Grid,
  },
})
export default class Home extends Vue {
  public checked =false;
}
</script>
