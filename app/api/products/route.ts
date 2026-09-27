import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.CJ_API_TOKEN;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'No se encontró CJ_API_TOKEN en .env.local' },
        { status: 400 }
      );
    }

    // 1. Obtener el Access Token dinámico usando tu API Key
    const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: apiKey
      })
    });

    const authData = await authRes.json();

    if (!authData.result || !authData.data?.accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Error al autenticar con CJ Dropshipping',
        details: authData
      }, { status: 401 });
    }

    const accessToken = authData.data.accessToken;

    // 2. Consultar la lista de productos usando el Access Token obtenido
    const productRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/list?keywords=skincare&pageSize=10', {
      method: 'GET',
      headers: {
        'CJ-Access-Token': accessToken,
        'Content-Type': 'application/json'
      }
    });

    const productData = await productRes.json();

    return NextResponse.json({
      success: true,
      data: productData
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}