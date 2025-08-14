import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, message: 'Refresh token eksik' },
                { status: 400 }
            );
        }

        // Private environment variable'lara server-side'da erişebiliriz
        const API_URL = process.env.NEXT_PRIVATE_API_URL;
        const API_KEY = process.env.NEXT_PRIVATE_API_KEY;

        if (!API_URL || !API_KEY) {
            return NextResponse.json(
                { success: false, message: 'API konfigürasyonu eksik' },
                { status: 500 }
            );
        }

        // External API'ye istek yap
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { success: false, message: data.message || 'Token yenileme başarısız' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Refresh token API hatası:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
