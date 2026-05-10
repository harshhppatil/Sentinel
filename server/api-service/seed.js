import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import { connectDB } from './src/config/db.js'
import Snippet from './src/kernelvault/snippet.model.js'

dotenv.config()

const snippets = [
  // ── Linux ──────────────────────────────────────────────────────
  {
    title:       'Find large files',
    command:     'find / -type f -size +100M -exec ls -lh {} \\; 2>/dev/null | sort -k5 -rh | head -20',
    description: 'Lists the top 20 files larger than 100MB on the system, sorted by size.',
    category:    'linux',
    difficulty:  'intermediate',
    tags:        ['#filesystem', '#storage', '#optimization'],
    usageCount:  42,
  },
  {
    title:       'Kill process by port',
    command:     'fuser -k 3000/tcp',
    description: 'Immediately kills whatever process is listening on port 3000.',
    category:    'linux',
    difficulty:  'beginner',
    tags:        ['#networking', '#process'],
    usageCount:  87,
  },
  {
    title:       'Check open ports',
    command:     'ss -tulnp',
    description: 'Shows all TCP/UDP ports that are currently listening, with the process name.',
    category:    'linux',
    difficulty:  'beginner',
    tags:        ['#networking', '#security'],
    usageCount:  65,
  },
  {
    title:       'Monitor real-time system calls',
    command:     'strace -p <PID> -e trace=network',
    description: 'Attaches to a running process and traces all network-related system calls in real time.',
    category:    'linux',
    difficulty:  'advanced',
    tags:        ['#debugging', '#networking', '#kernel'],
    usageCount:  18,
  },
  {
    title:       'Disk usage by directory',
    command:     'du -h --max-depth=1 / 2>/dev/null | sort -rh | head -15',
    description: 'Shows disk usage for top-level directories, sorted by size. Great for finding what is eating disk space.',
    category:    'linux',
    difficulty:  'beginner',
    tags:        ['#filesystem', '#storage'],
    usageCount:  55,
  },

  // ── Docker ─────────────────────────────────────────────────────
  {
    title:       'Remove all stopped containers',
    command:     'docker container prune -f',
    description: 'Force removes all stopped containers without confirmation prompt.',
    category:    'docker',
    difficulty:  'beginner',
    tags:        ['#cleanup', '#optimization'],
    usageCount:  93,
  },
  {
    title:       'Show container resource usage',
    command:     'docker stats --no-stream --format "table {{.Container}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"',
    description: 'One-shot snapshot of CPU and memory usage for all running containers.',
    category:    'docker',
    difficulty:  'intermediate',
    tags:        ['#monitoring', '#performance'],
    usageCount:  71,
  },
  {
    title:       'Full Docker system cleanup',
    command:     'docker system prune -af --volumes',
    description: 'WARNING: Removes ALL unused containers, images, networks and volumes. Use when disk is critical.',
    category:    'docker',
    difficulty:  'intermediate',
    tags:        ['#cleanup', '#storage'],
    usageCount:  34,
  },
  {
    title:       'Copy file from container to host',
    command:     'docker cp <container_id>:/path/in/container /path/on/host',
    description: 'Copies a file or directory from inside a running or stopped container to the host machine.',
    category:    'docker',
    difficulty:  'beginner',
    tags:        ['#files', '#containers'],
    usageCount:  48,
  },

  // ── Kubernetes ─────────────────────────────────────────────────
  {
    title:       'Get all resources in namespace',
    command:     'kubectl get all -n <namespace>',
    description: 'Lists all pods, services, deployments and replicasets in a specific namespace.',
    category:    'kubernetes',
    difficulty:  'beginner',
    tags:        ['#kubectl', '#namespace'],
    usageCount:  60,
  },
  {
    title:       'Force delete stuck pod',
    command:     'kubectl delete pod <pod-name> -n <namespace> --grace-period=0 --force',
    description: 'Immediately force deletes a pod stuck in Terminating state.',
    category:    'kubernetes',
    difficulty:  'intermediate',
    tags:        ['#kubectl', '#debugging'],
    usageCount:  39,
  },

  // ── Networking ─────────────────────────────────────────────────
  {
    title:       'Capture HTTP traffic on interface',
    command:     'tcpdump -i eth0 -A -s 0 port 80',
    description: 'Captures and prints all HTTP traffic on eth0 interface in ASCII. Replace eth0 with your interface.',
    category:    'networking',
    difficulty:  'advanced',
    tags:        ['#tcpdump', '#debugging', '#http'],
    usageCount:  27,
  },
  {
    title:       'Test TCP connection',
    command:     'nc -zv <host> <port>',
    description: 'Quick way to test if a TCP port is open and reachable on a remote host.',
    category:    'networking',
    difficulty:  'beginner',
    tags:        ['#netcat', '#connectivity'],
    usageCount:  76,
  },

  // ── Security ───────────────────────────────────────────────────
  {
    title:       'Find SUID binaries',
    command:     'find / -perm -4000 -type f 2>/dev/null',
    description: 'Finds all SUID binaries on the system — crucial for privilege escalation auditing.',
    category:    'security',
    difficulty:  'advanced',
    tags:        ['#suid', '#audit', '#privilege'],
    usageCount:  22,
  },
  {
    title:       'Check failed SSH login attempts',
    command:     'grep "Failed password" /var/log/auth.log | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -10',
    description: 'Lists top 10 IPs with the most failed SSH login attempts. First line of intrusion detection.',
    category:    'security',
    difficulty:  'intermediate',
    tags:        ['#ssh', '#intrusion', '#audit'],
    usageCount:  45,
  },

  // ── Monitoring ─────────────────────────────────────────────────
  {
    title:       'Watch command output every 2 seconds',
    command:     'watch -n 2 "docker ps --format \'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\'"',
    description: 'Refreshes docker container status every 2 seconds in a clean table format.',
    category:    'monitoring',
    difficulty:  'beginner',
    tags:        ['#watch', '#docker', '#realtime'],
    usageCount:  58,
  },
  {
    title:       'Parse Nginx access log for top IPs',
    command:     'awk \'{print $1}\' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10',
    description: 'Extracts and counts unique IP addresses from Nginx logs. Useful for traffic analysis.',
    category:    'monitoring',
    difficulty:  'intermediate',
    tags:        ['#nginx', '#logs', '#traffic'],
    usageCount:  33,
  },
]

const seedDB = async () => {
  await connectDB()

  await Snippet.deleteMany({})
  console.log('🗑️  Existing snippets cleared')

  await Snippet.insertMany(snippets)
  console.log(`✅  ${snippets.length} snippets seeded successfully`)

  mongoose.connection.close()
  console.log('🔌  DB connection closed. Sentinel Kernel Vault is ready! ⚡')
}

seedDB().catch((err) => {
  console.error('Seed failed:', err)
  mongoose.connection.close()
  process.exit(1)
})