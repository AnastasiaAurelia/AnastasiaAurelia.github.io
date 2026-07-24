import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons/TrendUpward'

/** An in-body callout for a single quantified outcome — kept honest by
 * requiring `context` so a bare number never appears without its source. */
export default defineType({
  name: 'metricHighlight',
  title: 'Metric highlight',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'What this metric measures, e.g. "Detection latency".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'The metric itself, e.g. "230ms" or "3.2x". Text, not a number, so units and qualifiers fit.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'text',
      rows: 2,
      description: 'The source or condition behind the number — required so a metric is never shown unsupported.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { label: 'label', value: 'value' },
    prepare({ label, value }) {
      return {
        title: `${value ?? ''} — ${label ?? 'Metric highlight'}`,
        subtitle: 'Metric highlight',
      }
    },
  },
})
