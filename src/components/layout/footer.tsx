import { Code, Camera, User, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-2">ADRIAN TAN</h3>
            <p className="text-sm text-muted-foreground">
              Capturing adventures and building for the web.
            </p>
          </div>

          <div className="flex gap-4">
            <a href="mailto:your-email@example.com" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
            <a href="https://github.com/adriantan09" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Code size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Camera size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
              <User size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Adrian Tan. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
