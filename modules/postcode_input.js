export const PostcodeInput = Vue.component('postcode-input', {
  template: `
    <div class="form-group">
      <label for="address-postcode">
        Enter a UK postcode
      </label>
      <input class="form-control" 
             id="address-postcode"
             v-bind:class="{
               'is-invalid': invalid
             }"
             name="address-postcode"
             type="text"
             placeholder="AB1 23CD"
             v-model="localValue"
             autocomplete="postal-code"
             list="postcodes" 
             aria-describedby="postcodeHelpBlock"/>
      <datalist id="postcodes">
        <option v-for="(item, index) in items"
                v-bind:key="index" 
                v-bind:value="item">
      </datalist>
      <small id="postcodeHelpBlock"
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
      invalid: false
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