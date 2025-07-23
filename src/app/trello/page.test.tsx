import Navbar from '@/components/Navbar'
import { render, screen } from '@testing-library/react'

describe('Navbar Component', () => {
    it('renders the Navbar component', () => {
        render(<Navbar />)
        expect(screen.getByText('Trello Page')).toBeInTheDocument()
    })

    it('renders the input with the placeholder "Search" ',() => {
        render(<Navbar/>)
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    })
})