import { NextResponse, NextRequest } from 'next/server';
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { getAuth } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

export async function GET(request: NextRequest) {
  const healthStatus = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      convex: 'unknown',
      liveblocks: 'unknown',
      clerk: 'unknown'
    }
  };

  try {
    // Check Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    await convex.query(api.documents.get, {
      paginationOpts: {
        numItems: 1,
        cursor: null
      }
    });
    healthStatus.services.convex = 'healthy';
  } catch (error) {
    healthStatus.services.convex = 'unhealthy';
    console.error('Convex health check failed:', error);
  }

  try {
    // Check Liveblocks
    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });
    const session = liveblocks.prepareSession('health-check', {
      userInfo: {
        name: 'Health Check',
        avatar: 'https://liveblocks.io/avatars/avatar-0.png',
        color: '#000000'
      }
    });
    await session.authorize();
    healthStatus.services.liveblocks = 'healthy';
  } catch (error) {
    healthStatus.services.liveblocks = 'unhealthy';
    console.error('Liveblocks health check failed:', error);
  }

  try {
    // Check Clerk
    const auth = getAuth(request);
    if (auth.userId) {
      healthStatus.services.clerk = 'healthy';
    } else {
      healthStatus.services.clerk = 'unhealthy';
    }
  } catch (error) {
    healthStatus.services.clerk = 'unhealthy';
    console.error('Clerk health check failed:', error);
  }

  return NextResponse.json(healthStatus);
} 