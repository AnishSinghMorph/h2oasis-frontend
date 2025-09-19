import { API_BASE_URL } from '../config/api';

interface ProductSelection {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    type: string;
    isActive: boolean;
  };
  selectedAt: string;
}

interface GetSelectionResponse {
  success: boolean;
  selection: ProductSelection;
}

export class ProductService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/products`;
  }

  async getMySelection(userId: string): Promise<ProductSelection | null> {
    try {
      const response = await fetch(`${this.baseUrl}/my-selection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-firebase-uid': userId, // Use the auth header that backend expects
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No selection found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GetSelectionResponse = await response.json();
      return data.selection;
    } catch (error) {
      console.error('Product service error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const productService = new ProductService();