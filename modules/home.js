import { PostcodeInput } from './postcode_input.js'

export const Home = Vue.component('home', {
  template: `
    <form v-on:submit.prevent="find" >
      <postcode-input v-model="postcode"
                      v-on:disabled="value => disabled = value">
      </postcode-input>
      <button type="submit"
              class="btn btn-primary"
              v-bind:disabled="disabled">
        Submit
      </button>
    </form>
  `,
  methods: {
    find() {
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(this.postcode)}/validate`)
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          if(data.result){
            this.$router.push({
              name:'detail',
              params:{
                postcode: this.postcode
              }
            })
          }
        })
        .catch(error => {
          console.warn('There was an error validating the postcode!', error)
        })
    }
  },
  data() {
    return {
      postcode: '',
      disabled: false
    }
  }
})