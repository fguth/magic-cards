<script setup lang="ts">
defineOptions({ name: 'TableCard' })

type TableAlign = 'left' | 'center' | 'right'
type TableCellValue = string | number | null | undefined

interface TableColumn {
  key: string
  label: string
  align?: TableAlign
  width?: string
  gapBefore?: boolean | 'small'
}

interface TableRow {
  [key: string]: TableCellValue
}

interface TableCardProps {
  title: string
  titleSuperscript?: string
  subtitle?: string
  columns: TableColumn[]
  rows: TableRow[]
  footerLabel?: string
  maxRows?: number
}

const props = withDefaults(defineProps<TableCardProps>(), {
  titleSuperscript: undefined,
  subtitle: undefined,
  footerLabel: undefined,
  maxRows: 10,
})

const visibleRows = computed(() => props.rows.slice(0, Math.max(1, props.maxRows)))
const resolvedFooterLabel = computed(() => {
  if (props.footerLabel) return props.footerLabel
  return undefined
})

const tableStyle = computed(() => ({
  '--table-card-column-template': props.columns.map((column) => column.width ?? 'minmax(0, 1fr)').join(' '),
}))

function columnAlign(column: TableColumn) {
  return column.align ?? 'left'
}

function cellValue(row: TableRow, key: string) {
  return row[key] == null ? '' : String(row[key])
}
</script>

<template>
  <ChartCard
    class="table-card"
    :title="title"
    :title-superscript="titleSuperscript"
    :subtitle="subtitle"
  >
    <div class="table-card__surface">
      <table class="table-card__table" :style="tableStyle">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                `table-card__cell--${columnAlign(column)}`,
                {
                  'table-card__cell--gap-before': column.gapBefore === true,
                  'table-card__cell--gap-before-small': column.gapBefore === 'small',
                },
              ]"
            >
              <span class="table-card__cell-content table-card__cell-content--heading">{{ column.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in visibleRows" :key="rowIndex">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                `table-card__cell--${columnAlign(column)}`,
                {
                  'table-card__cell--gap-before': column.gapBefore === true,
                  'table-card__cell--gap-before-small': column.gapBefore === 'small',
                },
              ]"
            >
              <span class="table-card__cell-content">{{ cellValue(row, column.key) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer-start>
      <span v-if="resolvedFooterLabel" class="table-card__footer-label">{{ resolvedFooterLabel }}</span>
    </template>
  </ChartCard>
</template>

<style scoped>
.table-card {
  --chart-card-canvas-height: 13.875rem;
  --chart-card-footer-gap: 0;
  --table-card-border: #d8d8d8;
  --table-card-text: #292929;
}

.table-card__surface {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.table-card__table {
  --table-card-row-padding-y: 12px;
  --table-card-column-gap: 16px;

  display: grid;
  grid-template-columns: var(--table-card-column-template);
  grid-auto-rows: auto;
  align-content: start;
  width: 100%;
  height: auto;
  border-collapse: collapse;
  color: var(--table-card-text);
  font-family: var(--arcade-font-regular);
  font-size: 0.4375rem;
  line-height: 1.02;
  letter-spacing: 0;
}

.table-card__table thead,
.table-card__table tbody,
.table-card__table tr {
  display: contents;
}

.table-card__table th,
.table-card__table td {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 0;
  padding: var(--table-card-row-padding-y) 0;
  border-bottom: 1px solid var(--table-card-border);
  box-sizing: border-box;
  overflow: hidden;
}

.table-card__table th {
  color: #111111;
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  line-height: 1.02;
}

.table-card__table td {
  overflow-wrap: normal;
  word-break: normal;
}

.table-card__cell-content {
  display: -webkit-box;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.table-card__cell-content--heading {
  -webkit-line-clamp: 2;
}

.table-card__cell--left {
  justify-content: flex-start;
  text-align: left;
}

.table-card__cell--center {
  justify-content: center;
  text-align: center;
}

.table-card__cell--right {
  justify-content: flex-end;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.table-card__table .table-card__cell--gap-before {
  padding-left: var(--table-card-column-gap);
}

.table-card__table .table-card__cell--gap-before-small {
  padding-left: var(--table-card-column-gap);
}

.table-card__footer-label {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  color: #9c9c9c;
  font-size: 0.3125rem;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
