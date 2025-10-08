import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ThemeTest() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Theme Test</h1>
        <p className="text-muted-foreground">
          Testing the new dark theme layout
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">Color Palette</CardTitle>
            <CardDescription>Theme color examples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-indigo-500 rounded"></div>
              <div className="h-10 bg-slate-500 rounded"></div>
              <div className="h-10 bg-emerald-500 rounded"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">Buttons</CardTitle>
            <CardDescription>Button variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-white">Typography</CardTitle>
          <CardDescription>Text styles and headings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Heading 1</h1>
            <h2 className="text-2xl font-semibold">Heading 2</h2>
            <h3 className="text-xl font-medium">Heading 3</h3>
            <p className="text-dark-text-secondary">
              This is a paragraph with secondary text color. The new dark theme should provide better contrast 
              and a more modern look for the POS system.
            </p>
            <p className="text-dark-text">
              This is a paragraph with primary text color. The overall design should feel more professional 
              and easier on the eyes during long work sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}