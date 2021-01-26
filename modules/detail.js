export const Detail = Vue.component('detail', {
  template: `
    <div>
      <div>
        <h1>{{postcode}}</h1>
        <div v-if="loading && !error" class="m-4 d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span v-if="!error"
                  class="sr-only">
              Loading...
            </span>
          </div>
        </div>
        <div v-if="error"
             class="alert alert-danger"
             role="alert">
          There seems to be an issue with that postcode, please <router-link to="/">go back</router-link> and try again. You don't need to have spaces or uppercase letters to search
        </div>
      </div>
      <div v-if="!loading || !error">
        <dl class="row" v-if="country || region">
          <template v-if="country">
            <dt class="col-sm-3">Country:</dt>
            <dd class="col-sm-9">{{country}}</dd>
          </template>
          <template v-if="region">
            <dt class="col-sm-3">Region:</dt>
            <dd class="col-sm-9">{{region}}</dd>
          </template>
        </dl>
      <template v-if="nearest">
        <h3>It's nearest postcodes are:</h3>
          <ul>
            <li v-for="(postcode, index) in nearest"
                v-bind:key="index">
              <router-link v-bind:to="postcode">
                {{postcode}}
              </router-link>            
            </li>
          </ul>
        </template>
      </div>
    </div>
  `,
  created(){
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.error = false
      this.postcode = this.$route.params.postcode
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(this.postcode)}`)
        .then(async response => {
          const data = await response.json()
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          this.error = false
          this.loading = false
          this.country = data.result.country
          this.region = data.result.region
        })
        .catch(error => {
          this.error = true
          this.country = null
          this.region = null
          console.warn('There was an error fetching postcode data!', error)
        })
      fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(this.postcode)}/nearest`)
        .then(async response => {
          const data = await response.json()
          if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error)
          }
          this.nearest = data.result.map(postcode => postcode.postcode)
        })
        .catch(error => {
          this.nearest = null
          console.warn('There was an error fetching the nearest postcodes!', error)
        })
    }
  },
  data() {
    return {
      loading: true,
      error: true,
      postcode: null,
      country: null,
      region: null,
      nearest: null,
    }
  },
  watch: {
    // fetch again, once the route changes
    '$route': 'fetchData'
  }
})