<script>
import {defineComponent} from "vue";
import MarkdownIt from 'markdown-it';
import markdownItMultimdTable from 'markdown-it-multimd-table';

export default defineComponent({
  name: "MarkdownViewer",
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    // Инициализация markdown-it с опциями и плагинами
    const md = new MarkdownIt({
      html: true,        // Разрешить HTML теги
      linkify: true,     // Автоматически преобразовывать ссылки
      typographer: true, // Улучшенная типографика
      breaks: true       // Преобразовывать переносы строк в <br>
    });
    
    // Добавляем плагин для таблиц (multimd-table поддерживает расширенный синтаксис таблиц)
    md.use(markdownItMultimdTable, {
      multiline: true,
      rowspan: true,
      headerless: true,
      multibody: true,
      autolabel: true
    });
    
    return {
      md: md
    };
  },
  computed: {
    renderedContent() {
      if (!this.content) return '';
      return this.md.render(this.content);
    }
  }
})
</script>

<template>
  <div class="markdown-viewer" v-html="renderedContent"></div>
</template>

<style scoped>
.markdown-viewer :deep(h1) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-viewer :deep(h2) {
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-viewer :deep(h3) {
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
}

.markdown-viewer :deep(h4) {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
}

.markdown-viewer :deep(ul), 
.markdown-viewer :deep(ol) {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.markdown-viewer :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-viewer :deep(p) {
  margin-bottom: 0.5rem;
}

.markdown-viewer :deep(strong) {
  font-weight: bold;
}

/* Стили для таблиц Markdown */
.markdown-viewer :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.markdown-viewer :deep(table th),
.markdown-viewer :deep(table td) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 0.5rem;
  text-align: left;
}

.markdown-viewer :deep(table th) {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: bold;
}

.markdown-viewer :deep(table tr:nth-child(even)) {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
