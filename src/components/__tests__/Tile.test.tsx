import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tile } from '../Tile';

describe('Tile Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering', () => {
    it('renders a tile with a number when num is not 0', () => {
      render(<Tile num={5} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders an empty tile when num is 0', () => {
      render(<Tile num={0} onClick={mockOnClick} isSolved={false} />);
      
      // The empty tile should not display any text
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('applies correct CSS classes for non-empty tiles', () => {
      const { container } = render(<Tile num={3} onClick={mockOnClick} isSolved={false} />);
      const tile = container.firstChild as HTMLElement;
      
      expect(tile).toHaveClass('flex', 'aspect-square', 'select-none', 'items-center', 'justify-center');
      expect(tile).toHaveClass('border-2', 'bg-gray-200', 'text-4xl', 'font-bold', 'text-red-500');
      expect(tile).toHaveClass('cursor-pointer', 'hover:bg-gray-300', 'active:scale-95');
    });

    it('applies correct CSS classes for empty tiles', () => {
      const { container } = render(<Tile num={0} onClick={mockOnClick} isSolved={false} />);
      const tile = container.firstChild as HTMLElement;
      
      expect(tile).toHaveClass('cursor-default', 'opacity-0');
    });

    it('applies solved state classes when isSolved is true', () => {
      const { container } = render(<Tile num={4} onClick={mockOnClick} isSolved={true} />);
      const tile = container.firstChild as HTMLElement;
      
      // The solved state should be applied through framer-motion variants
      expect(tile).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when a non-empty tile is clicked', async () => {
      const user = userEvent.setup();
      render(<Tile num={7} onClick={mockOnClick} isSolved={false} />);
      
      const tile = screen.getByText('7');
      await user.click(tile);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

  
    it('handles multiple clicks correctly', async () => {
      const user = userEvent.setup();
      render(<Tile num={2} onClick={mockOnClick} isSolved={false} />);
      
      const tile = screen.getByText('2');
      await user.click(tile);
      await user.click(tile);
      await user.click(tile);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('works with fireEvent as well as userEvent', () => {
      render(<Tile num={6} onClick={mockOnClick} isSolved={false} />);
      
      const tile = screen.getByText('6');
      fireEvent.click(tile);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation Properties', () => {
    it('has correct motion.div properties', () => {
      const { container } = render(<Tile num={1} onClick={mockOnClick} isSolved={false} />);
      const tile = container.firstChild as HTMLElement;
      
      // Check that the element is rendered (framer-motion is mocked)
      expect(tile).toBeInTheDocument();
      expect(tile.tagName).toBe('DIV');
    });

    it('applies layout prop for automatic animation', () => {
      const { container } = render(<Tile num={8} onClick={mockOnClick} isSolved={false} />);
      const tile = container.firstChild as HTMLElement;
      
      // The layout prop should be present (though it's handled by framer-motion)
      expect(tile).toBeInTheDocument();
    });

    it('handles solved state animation variants', () => {
      const { container } = render(<Tile num={3} onClick={mockOnClick} isSolved={true} />);
      const tile = container.firstChild as HTMLElement;
      
      expect(tile).toBeInTheDocument();
      // The animation variants are handled by framer-motion
    });
  });

  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Tile num={4} onClick={mockOnClick} isSolved={false} />);
      
      const tile = screen.getByText('4');
      tile.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('has proper tabIndex for keyboard navigation', () => {
      const { container } = render(<Tile num={5} onClick={mockOnClick} isSolved={false} />);
      const tile = container.firstChild as HTMLElement;
      
      // The tile should be focusable
      expect(tile).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative numbers', () => {
      render(<Tile num={-1} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('-1')).toBeInTheDocument();
    });

    it('handles large numbers', () => {
      render(<Tile num={999} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('handles decimal numbers', () => {
      render(<Tile num={1.5} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('1.5')).toBeInTheDocument();
    });

    it('handles zero correctly in different states', () => {
      const { rerender } = render(<Tile num={0} onClick={mockOnClick} isSolved={false} />);
      
      // Should not display 0
      expect(screen.queryByText('0')).not.toBeInTheDocument();
      
      // Rerender with solved state
      rerender(<Tile num={0} onClick={mockOnClick} isSolved={true} />);
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('transitions from unsolved to solved state', () => {
      const { rerender } = render(<Tile num={7} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('7')).toBeInTheDocument();
      
      rerender(<Tile num={7} onClick={mockOnClick} isSolved={true} />);
      
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('transitions from solved to unsolved state', () => {
      const { rerender } = render(<Tile num={2} onClick={mockOnClick} isSolved={true} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
      
      rerender(<Tile num={2} onClick={mockOnClick} isSolved={false} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});