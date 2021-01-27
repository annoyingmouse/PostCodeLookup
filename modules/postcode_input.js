export const PostcodeInput = Vue.component('postcode-input', {
  template: `
    <div class="form-group">
      <label v-bind:for="id">
        Enter a UK postcode
      </label>
      <input class="form-control" 
             v-bind:id="id"
             v-bind:class="{
               'is-invalid': invalid
             }"
             v-bind:name="id"
             type="text"
             placeholder="AB1 23CD"
             v-model="localValue"
             autocomplete="postal-code"
             v-bind:list="id+'_list'" 
             v-bind:aria-describedby="id+'_help_block'"/>
      <datalist v-bind:id="id+'_list'">
        <option v-for="(item, index) in items"
                v-bind:key="index" 
                v-bind:value="item">
      </datalist>
      <small v-bind:id="id+'_help_block'"
             class="form-text text-muted">
        Please enter a UK postocde
      </small>
    </div>
  `,
  props: {
    value: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      items: [],
      localValue: '',
      invalid: false,
      id: null
    }
  },
  watch:{
    localValue: function(value) {
      this.invalid = false
      this.fetchItems()
      this.$emit("input", value)
    },
    invalid: function(value){
      this.$emit("disabled", value)
    }
  },
  created() {
    this.localValue = this.value
  },
  mounted () {
    this.id = this._uid
  },
  methods: {
    fetchItems() {
      if(this.localValue){
        fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(this.localValue)}/autocomplete`)
          .then(async response => {
            const data = await response.json()
            if (!response.ok) {
              const error = (data && data.message) || response.statusText
              return Promise.reject(error)
            }
            if(data.result){
              this.items = data.result
            }else{
              fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(this.localValue)}/validate`)
                .then(async response => {
                  const data = await response.json()
                  if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error)
                  }
                  if(!data.result){
                    this.invalid = true
                  }
                })
                .catch(error => {
                  console.warn('There was an error validating the postcode!', error)
                })
            }
          })
          .catch(error => {
            console.warn('There was an error fetching postcode data!', error)
          })
      }
    }
  }
})