import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { GithubIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contributors - OpenCut",
  description:
    "Meet the amazing people who contribute to OpenCut, the free and open-source video editor.",
  openGraph: {
    title: "Contributors - OpenCut",
    description:
      "Meet the amazing people who contribute to OpenCut, the free and open-source video editor.",
    type: "website",
  },
};

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

async function getContributors(): Promise<Contributor[]> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/OpenCut-app/OpenCut/contributors",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "OpenCut-Web-App",
        },
        next: { revalidate: 600 }, // 10 minutes
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch contributors");
      return [];
    }

    const contributors = await response.json();

    const filteredContributors = contributors.filter(
      (contributor: Contributor) => contributor.type === "User",
    );

    return filteredContributors;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}

export default async function ContributorsPage() {
  const contributors = await getContributors();
  const topContributors = contributors.slice(0, 2);
  const otherContributors = contributors.slice(2);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="-top-40 -right-40 absolute h-96 w-96 rounded-full bg-gradient-to-br from-muted/20 to-transparent blur-3xl" />
          <div className="-left-40 absolute top-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-muted/10 to-transparent blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-20 text-center">
              <Badge variant="secondary" className="mb-6 gap-2">
                <GithubIcon className="h-3 w-3" />
                Open Source
              </Badge>
              <h1 className="mb-6 font-bold text-5xl tracking-tight md:text-6xl">
                Contributors
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl leading-relaxed">
                Meet the amazing developers who are building the future of video
                editing
              </p>

              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                  <span className="font-medium">{contributors.length}</span>
                  <span className="text-muted-foreground">contributors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                  <span className="font-medium">
                    {contributors.reduce((sum, c) => sum + c.contributions, 0)}
                  </span>
                  <span className="text-muted-foreground">contributions</span>
                </div>
              </div>
            </div>

            {topContributors.length > 0 && (
              <div className="mb-20">
                <div className="mb-12 text-center">
                  <h2 className="mb-2 font-semibold text-2xl">
                    Top Contributors
                  </h2>
                  <p className="text-muted-foreground">
                    Leading the way in contributions
                  </p>
                </div>

                <div className="mx-auto flex max-w-4xl flex-col justify-center gap-6 md:flex-row">
                  {topContributors.map((contributor) => (
                    <Link
                      key={contributor.id}
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block flex-1"
                    >
                      <div className="relative mx-auto max-w-md">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 blur transition-all duration-300 group-hover:blur-md" />
                        <Card className="relative border-2 bg-background/80 backdrop-blur-sm transition-all duration-300 group-hover:border-muted-foreground/20 group-hover:shadow-xl">
                          <CardContent className="p-8 text-center">
                            <div className="relative mb-6">
                              <Avatar className="mx-auto h-24 w-24 shadow-2xl ring-4 ring-background">
                                <AvatarImage
                                  src={contributor.avatar_url}
                                  alt={`${contributor.login}'s avatar`}
                                />
                                <AvatarFallback className="font-semibold text-lg">
                                  {contributor.login.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <h3 className="mb-2 font-semibold text-xl transition-colors group-hover:text-foreground/80">
                              {contributor.login}
                            </h3>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {contributor.contributions}
                              </span>
                              <span>contributions</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherContributors.length > 0 && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="mb-2 font-semibold text-2xl">
                    All Contributors
                  </h2>
                  <p className="text-muted-foreground">
                    Everyone who makes OpenCut better
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {otherContributors.map((contributor, index) => (
                    <Link
                      key={contributor.id}
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="rounded-xl p-2 text-center transition-all duration-300 hover:opacity-50">
                        <Avatar className="mx-auto mb-3 h-16 w-16">
                          <AvatarImage
                            src={contributor.avatar_url}
                            alt={`${contributor.login}'s avatar`}
                          />
                          <AvatarFallback className="font-medium">
                            {contributor.login.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mb-1 truncate font-medium text-sm transition-colors group-hover:text-foreground">
                          {contributor.login}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          {contributor.contributions}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {contributors.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                  <GithubIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-3 font-medium text-xl">
                  No contributors found
                </h3>
                <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                  Unable to load contributors at the moment. Check back later or
                  view on GitHub.
                </p>
                <Link
                  href="https://github.com/OpenCut-app/OpenCut/graphs/contributors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    <GithubIcon className="h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-32 text-center">
              <div className="mx-auto max-w-2xl">
                <h2 className="mb-4 font-bold text-3xl">Join the community</h2>
                <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
                  OpenCut is built by developers like you. Every contribution,
                  no matter how small, helps make video editing more accessible
                  for everyone.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="https://github.com/OpenCut-app/OpenCut/blob/main/.github/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="group gap-2">
                      <GithubIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      Start Contributing
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/OpenCut-app/OpenCut/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="group gap-2">
                      Browse Issues
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
