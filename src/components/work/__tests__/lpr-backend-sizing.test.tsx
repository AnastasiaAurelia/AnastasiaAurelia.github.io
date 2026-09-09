import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LprBackendSizing } from '../lpr-backend-sizing'

describe('100-site infrastructure visuals', () => {
  it('shows every annual cost exactly, with proportional horizontal bars and the correct total', () => {
    render(<LprBackendSizing />)
    const rows = within(screen.getByRole('list', { name: 'Annual costs in RMB, sorted largest first' })).getAllByRole('listitem')
    const expected = [
      ['OSS storage', '17,406'], ['MySQL RDS', '8,226'], ['Application ECS ×2', '8,138.30'],
      ['Nacos + RabbitMQ ECS ×3', '6,942.60'], ['SLB', '5,000'], ['NAT Gateway', '5,000'],
      ['Testing + Monitoring ECS', '4,069.15'], ['SSL', '2,000'], ['Public Traffic', '1,332'],
      ['Redis', '816'], ['API Calls', '100'], ['Domain', '100'],
    ]
    expect(rows).toHaveLength(expected.length)
    expected.forEach(([label, amount], index) => {
      expect(within(rows[index]).getByText(label)).toBeInTheDocument()
      expect(within(rows[index]).getByText(amount)).toBeInTheDocument()
      const bar = rows[index].querySelector<HTMLElement>('[aria-hidden] > div')!
      expect(parseFloat(bar.style.width)).toBeCloseTo(Number(amount.replaceAll(',', '')) / 17406 * 100)
    })
    expect(screen.getByText('RMB 59,130.05', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('29.4% of total')).toBeInTheDocument()
  })

  it('renders native accessible infrastructure with the specified capacities and no workbook reference', () => {
    const { container } = render(<LprBackendSizing />)
    const svg = screen.getByRole('img', { name: '100-site LPR infrastructure' })
    for (const label of ['100 Parking Sites', 'Server Load Balancer', 'Application Layer · 2 × ECS', 'Redis HA', 'MySQL RDS HA', 'Nacos + RabbitMQ', 'OSS Image Storage', '≈ 14 TB / year']) {
      expect(within(svg).getByText(label)).toBeInTheDocument()
    }
    expect(within(svg).getAllByText('Application ECS')).toHaveLength(2)
    expect(svg.querySelector('desc')).toHaveTextContent('three-node')
    expect(svg.parentElement).toHaveClass('overflow-x-auto')
    expect(svg).toHaveClass('min-w-[780px]', 'lg:min-w-0')
    expect(container.querySelectorAll('figure')).toHaveLength(2)
    expect(container.querySelectorAll('figcaption')).toHaveLength(2)
    expect(container.querySelector('img, image, iframe, a, [src], [href]')).toBeNull()
    expect(container.textContent).not.toMatch(/\.xlsx|Server Requirements|account|credential/i)
  })
})
