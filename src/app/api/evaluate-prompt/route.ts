import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ratings, comment, tags } = body

    // TODO: 持久化评价数据到数据库
    console.log('收到提示词评价:', { ratings, comment, tags })

    return NextResponse.json({
      success: true,
      message: '评价提交成功',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '提交评价失败' },
      { status: 500 }
    )
  }
}
