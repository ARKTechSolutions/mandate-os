import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  inject,
  OnDestroy,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface SafeLine {
  x: number;
  y: number;
  speed: number;
  length: number;
  hue: number;
  opacity: number;
}

const RISK_INTERVAL_BASE = 3500;

@Component({
  selector: 'app-animated-network',
  standalone: true,
  template: '<canvas #canvas></canvas>',
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AnimatedNetworkComponent implements AfterViewInit, OnDestroy {
  private readonly canvasRef =
    viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  private animId = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private w = 0;
  private h = 0;

  private safeLines: SafeLine[] = [];
  private riskTimer = 0;
  private lastRiskMs = 0;

  private risky: {
    active: boolean;
    x: number;
    y: number;
    speed: number;
    intercepted: boolean;
  } = { active: false, x: 0, y: 0, speed: 0, intercepted: false };

  private wallFlashMs = 0;

  private resizeObserver: ResizeObserver | null = null;
  private readonly platformId = inject(PLATFORM_ID);

  @HostBinding('attr.aria-hidden') ariaHidden = 'true';

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animId);
      this.resizeObserver?.disconnect();
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.resizeObserver = new ResizeObserver(() => this.syncSize());
    const parent = canvas.parentElement;
    if (parent) this.resizeObserver.observe(parent);
    this.syncSize();
    this.spawnSafeLines(18);
    this.lastRiskMs = performance.now();
    this.tick(performance.now());
  }

  private syncSize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    canvas.width = this.w * dpr;
    canvas.height = this.h * dpr;
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private wallX(): number {
    return this.w * 0.5;
  }

  private spawnSafeLines(count: number): void {
    this.safeLines = [];
    for (let i = 0; i < count; i++) {
      this.safeLines.push(this.makeSafeLine(i / count));
    }
  }

  private makeSafeLine(phase: number = 0): SafeLine {
    const y = 4 + Math.random() * Math.max(this.h - 8, 1);
    return {
      x: -200 + phase * (this.w + 600) * -1,
      y,
      speed: 50 + Math.random() * 130,
      length: 60 + Math.random() * 120,
      hue: 180 + Math.random() * 40,
      opacity: 0.2 + Math.random() * 0.35,
    };
  }

  private spawnRisky(): void {
    const wallTop = this.h * 0.10;
    const wallBottom = this.h * 0.90;
    this.risky = {
      active: true,
      x: -60,
      y: wallTop + Math.random() * (wallBottom - wallTop),
      speed: 90 + Math.random() * 80,
      intercepted: false,
    };
  }

  private tick(now: number): void {
    this.animId = requestAnimationFrame((t) => this.tick(t));

    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.w;
    const h = this.h;
    if (w < 10 || h < 10) {
      this.riskTimer += 16;
      return;
    }

    ctx.clearRect(0, 0, w, h);
    const delta = Math.min(32, now - (this.lastRiskMs !== now ? now - this.lastRiskMs : 16));
    this.lastRiskMs = now;
    const sec = delta / 1000;

    const wallPos = this.wallX();

    // --- risky line (drawn first, behind everything) ---
    if (this.risky.active) {
      this.risky.x += this.risky.speed * sec;

      // Clamp at wall — line stops here, never passes through
      if (this.risky.x >= wallPos) {
        if (!this.risky.intercepted) {
          this.risky.intercepted = true;
          this.wallFlashMs = now + 400;
        }
        this.risky.x = wallPos;
      }

      // Draw the approach segment, clamped to never extend past wallPos
      const segLeft = Math.max(this.risky.x - 60, 4);
      const segRight = Math.min(this.risky.x, wallPos);
      if (segLeft < segRight) {
        ctx.beginPath();
        const alpha = this.risky.intercepted ? 0.55 : 0.5;
        ctx.strokeStyle = `hsla(25, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'hsla(25, 100%, 60%, 0.25)';
        ctx.shadowBlur = 6;
        ctx.moveTo(segLeft, this.risky.y);
        ctx.lineTo(segRight, this.risky.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Fade out intercepted lines
      if (this.risky.intercepted) {
        const elapsed = now - (this.wallFlashMs - 400);
        if (elapsed > 600) {
          this.risky.active = false;
          this.riskTimer = 0;
        }
      }
    } else {
      this.riskTimer += delta;
      if (this.riskTimer >= RISK_INTERVAL_BASE + Math.random() * 1500) {
        this.spawnRisky();
      }
    }

    ctx.shadowBlur = 0;

    // --- center wall (drawn on top of risky line, below safe lines) ---
    const flashing = now < this.wallFlashMs;
    const wallColor = flashing
      ? 'hsla(0, 65%, 45%, 0.85)'
      : 'hsla(190, 100%, 55%, 0.6)';
    const wallGlow = flashing
      ? 'hsla(0, 65%, 45%, 0.4)'
      : 'hsla(190, 100%, 55%, 0.3)';

    ctx.beginPath();
    ctx.strokeStyle = wallColor;
    ctx.lineWidth = flashing ? 3 : 2;
    ctx.shadowColor = wallGlow;
    ctx.shadowBlur = flashing ? 22 : 14;
    ctx.moveTo(wallPos, h * 0.08);
    ctx.lineTo(wallPos, h * 0.92);
    ctx.stroke();

    // Subtle shimmer on wall when not flashing
    if (!flashing) {
      const shimmer = 0.3 + 0.12 * Math.sin(now * 0.002);
      ctx.beginPath();
      ctx.strokeStyle = `hsla(190, 100%, 70%, ${shimmer * 0.2})`;
      ctx.lineWidth = 6;
      ctx.shadowColor = 'hsla(190, 100%, 70%, 0.08)';
      ctx.shadowBlur = 10;
      ctx.moveTo(wallPos, h * 0.08);
      ctx.lineTo(wallPos, h * 0.92);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;

    // --- safe lines (drawn on top — they pass through the wall) ---
    for (const line of this.safeLines) {
      line.x += line.speed * sec;

      if (line.x - line.length > w + 100) {
        const replacement = this.makeSafeLine();
        replacement.x = -200 - Math.random() * 400;
        Object.assign(line, replacement);
      }

      const x0 = line.x - line.length;
      const x1 = line.x;

      ctx.beginPath();
      ctx.strokeStyle = `hsla(${line.hue}, 100%, 70%, ${line.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = `hsla(${line.hue}, 100%, 65%, 0.25)`;
      ctx.shadowBlur = 5;
      ctx.moveTo(x0, line.y);
      ctx.lineTo(x1, line.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }
}
