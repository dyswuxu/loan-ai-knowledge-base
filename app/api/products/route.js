/**
 * 产品列表 API
 */
import { NextResponse } from 'next/server';
const { getAllProducts, getProductsByBank, getProductsByType } = require('../../../lib/rag');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bank = searchParams.get('bank');
    const type = searchParams.get('type');
    
    let products;
    
    if (bank) {
      products = getProductsByBank(bank);
    } else if (type) {
      products = getProductsByType(type);
    } else {
      products = getAllProducts();
    }

    return NextResponse.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Products error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get products'
    }, { status: 500 });
  }
}
