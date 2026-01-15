import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messageId, helpful } = await request.json();
    
    if (!sessionId || !messageId || typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'sessionId, messageId, and helpful (boolean) are required' },
        { status: 400 }
      );
    }
    
    const { error } = await supabaseAdmin
      .from('user_feedback')
      .insert({
        session_id: sessionId,
        message_id: messageId,
        helpful
      });
    
    if (error) {
      console.error('Feedback insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your feedback' },
      { status: 500 }
    );
  }
}
