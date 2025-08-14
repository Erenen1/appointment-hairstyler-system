import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { success: false, message: 'Authorization header eksik' },
                { status: 401 }
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
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'Authorization': authHeader,
            },
        });

        if (response.ok) {
            return NextResponse.json({ success: true, message: 'Logout başarılı' });
        } else {
            const data = await response.json();
            return NextResponse.json(
                { success: false, message: data.message || 'Logout başarısız' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Logout API hatası:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
