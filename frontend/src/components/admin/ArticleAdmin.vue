<template>
  <div class="article-admin">
    <b-form>
      <input id="article-id" type="hidden" v-model="article.id">
      <b-form-group label="Nome:" label-for="article-name" >
        <b-form-input type="text" id="article-name" 
          v-model="article.name" required
          :readonly="mode === 'remove'"
          placeholder="Informe o nome da artigo..."/>
      </b-form-group>
      <b-form-group label="Descrição:" label-for="article-description" >
        <b-form-input type="text" id="article-description" 
          v-model="article.description" required
          :readonly="mode === 'remove'"
          placeholder="Informe a descrição do artigo..."/>
      </b-form-group>
      <b-form-group label="Imagem (URL):" label-for="article-imageUrl" >
        <b-form-input type="text" id="article-imageUrl" 
          v-model="article.imageUrl"
          :readonly="mode === 'remove'"
          placeholder="Informe a URL da imagem..."/>
      </b-form-group>
      <b-form-group label="Categoria:" label-for="article-categoryId"
        v-if="mode === 'save'" >
        <b-form-select id="article-categoryId" 
          v-model="article.categoryId"
          :options="optionsCategory"/>
      </b-form-group>
      <b-form-group label="Autor:" label-for="article-userId"
        v-if="mode === 'save'" >
        <b-form-select id="article-userId" 
          v-model="article.userId"
          :options="optionsAuthor"/>
      </b-form-group>
      <b-form-group  label="Conteúdo" labal="article-content"
        v-if="mode === 'save'">
        <VueEditor id="article-content"
          v-model="article.content"
          placeholder="Informe o conteúdo do artigo..." />
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
    <b-table hover striped :items="articles" :fields="fields">
      <template slot="actions" slot-scope="data">
        <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2" >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="loadArticle(data.item, 'remove')" >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { showError, baseApiUrl} from '@/global'
import axios from 'axios'

export default {
  name: 'ArticleAdmin',
  components: {VueEditor},
  data: function() {
    return {
      mode: 'save',
      article: {},
      articles: [],
      optionsCategory: [],
      optionsAuthor: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: 'id', label: 'Código', sortable: true},
        { key: 'name', label: 'Nome', sortable: true},
        { key: 'description', label: 'Descrição', sortable: true},
        { key: 'actions', label: 'Ações'}
      ],
    }
  },
  methods: {
    loadArticles(){
      axios.get(`${baseApiUrl}/articles?page=${this.page}`)
        .then(res => {
          this.articles = res.data.data
          this.count = res.data.count
          this.limit = res.data.limit
        })
    },
    loadCategories(){
      axios.get(`${baseApiUrl}/categories`)
        .then(res => {
          this.optionsCategory = res.data.map(category => {
            return { value: category.id, text: category.path }
          })
        })
    },                 
    loadUsers(){
      axios.get(`${baseApiUrl}/users`)
        .then(res => {
          this.optionsAuthor = res.data.map(user => {
            return { value: user.id, text: `${user.name} - ${user.email}` }
          })
        })
    },                 
    reset() {
      this.mode = 'save'
      this.article = {}
      this.loadArticles()
      this.loadCategories()
      this.loadUsers()
    },
    save() {
      const method = this.article.id ? 'put' : 'post'
      const id = this.article.id ? `/${this.article.id}` : ''
      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    remove() {
      const id = this.article.id
      axios.delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    loadArticle(article, mode = 'save'){
      this.mode = mode
      // this.article = article
      axios.get(`${baseApiUrl}/articles/${article.id}`)
        .then(res => this.article = res.data)
    }
  },
  watch: {
    page() {
      this.loadArticles()
    }
  },
  mounted(){
    this.loadArticles()
    this.loadCategories()
    this.loadUsers()
  }
}
</script>

<style>

</style>