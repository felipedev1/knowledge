<template>
  <div class="category-admin">
    <b-form>
      <input id="category-id" type="hidden" v-model="category.id">
      <b-form-group label="Nome:" label-for="category-name" >
        <b-form-input type="text" id="category-name" 
          v-model="category.name" required
          :readonly="mode === 'remove'"
          placeholder="Informe o nome da categoria..."/>
      </b-form-group>
      <b-form-group label="Categoria Pai:" label-for="category-parentId" >
        <b-form-select v-if="mode === 'save'"
          id="category-parentId" 
          v-model="category.parentId"
          :options="options"/>
        <b-form-input v-else
          type="text" readonly
          id="category-parentId" 
          v-model="category.path"/>
      </b-form-group>
      <b-button variant="primary" @click="save" v-if="mode === 'save'">
        Salvar
      </b-button>
      <b-button variant="danger" @click="remove" v-if="mode === 'remove'">
        Excluir
      </b-button>
      <b-button @click="reset" class="ml-2">Cancelar</b-button>
    </b-form>
    <hr>
    <b-table hover striped :items="categories" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadCategory(data.item)" class="mr-2" >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="loadCategory(data.item, 'remove')" >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { showError, baseApiUrl} from '@/global'
import axios from 'axios'

export default {
  name: 'CategoryAdmin',
  data: function() {
    return {
      mode: 'save',
      category: {},
      categories: [],
      options: [],
      fields: [
        { key: 'id', label: 'Código', sortable: true},
        { key: 'name', label: 'Nome', sortable: true},
        { key: 'path', label: 'Caminho', sortable: true},
        { key: 'actions', label: 'Ações'}
      ],
    }
  },
  methods: {
    loadCategories(){
      axios.get(`${baseApiUrl}/categories`)
        .then(res => {
          this.categories = res.data
          this.options = this.categories.map(category => {
            return { value: category.id, text: category.path }
          })
        })
    },
    reset() {
      this.mode = 'save'
      this.category = {}
      this.loadCategories()
    },
    save() {
      const method = this.category.id ? 'put' : 'post'
      const id = this.category.id ? `/${this.category.id}` : ''
      axios[method](`${baseApiUrl}/categories${id}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.category.id
      axios.delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    loadCategory(category, mode = 'save'){
      this.mode = mode
      this.category = category
    }
  },
  mounted(){
    this.loadCategories()
  }
}
</script>

<style>

</style>