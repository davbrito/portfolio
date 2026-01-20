import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PortfolioData } from "@/data/portfolio";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
    lineHeight: 1.35,
  },
  header: {
    marginBottom: 8,
    gap: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  title: {
    fontSize: 11,
    color: "#374151",
    marginTop: 2,
  },
  metaItem: {
    fontSize: 9,
    color: "#374151",
  },
  section: {
    marginTop: 12,
    lineHeight: 1.1,
    fontSize: 8,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  separator: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginTop: 10,
  },
  paragraph: {
    fontSize: 9.5,
    color: "#1f2937",
    lineHeight: 1.1,
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  experienceTitle: {
    fontSize: 10,
    fontWeight: 600,
  },
  experienceCompany: {
    fontSize: 9.5,
    color: "#374151",
  },
  experiencePeriod: {
    fontSize: 9,
    color: "#374151",
  },
  bullets: {
    marginTop: 4,
    gap: 2,
  },
  bullet: {
    fontSize: 9,
    color: "#1f2937",
  },
  bulletRow: {
    flexDirection: "row",
    gap: 6,
  },
  bulletMark: {
    fontSize: 9,
    color: "#111827",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillGroup: {
    flexBasis: 170,
    flexGrow: 1,
  },
  skillGroupTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    marginBottom: 4,
  },
  skillItem: {
    fontSize: 9,
    color: "#374151",
  },
  projectCard: {
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 700,
  },
  projectDescription: {
    fontSize: 9,
    color: "#374151",
    marginTop: 3,
  },
  projectLinks: {
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  projectLink: {
    fontSize: 8.5,
    color: "#111827",
  },
  projectTags: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    fontSize: 8.5,
    color: "#374151",
  },
});

export function CurriculumDocument({ data }: { data: PortfolioData }) {
  const { profile, experience, technologies, projects } = data;
  const aboutParagraphs = profile.aboutText ? profile.aboutText.split(/\n{2,}/).filter((p) => p.trim().length > 0) : [];

  const contacts = [profile.location, profile.email, profile.githubUrl, profile.linkedinUrl].filter(
    Boolean,
  ) as string[];

  const formatUrl = (value: string) =>
    value
      .replace(/^mailto:/i, "")
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "");

  return (
    <Document author={profile.name} title={`Currículum de ${profile.name}`} creationDate={new Date()} language="es">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.title}>{profile.title}</Text>
          <View style={styles.contactRow}>
            {contacts.map((item) => (
              <Text key={item} style={styles.metaItem}>
                {formatUrl(item)}
              </Text>
            ))}
          </View>
        </View>

        {aboutParagraphs.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            {aboutParagraphs.map((paragraph) => (
              <Text key={paragraph} style={[styles.paragraph, { marginTop: 4 }]}>
                {paragraph.replace(/[\s]+/g, " ").trim()}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.separator} />

        {experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiencia</Text>
            {experience.map((item) => (
              <View key={item.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.experienceTitle}>{item.title}</Text>
                    <Text style={styles.experienceCompany}>{item.company}</Text>
                  </View>
                  <Text style={styles.experiencePeriod}>{item.period}</Text>
                </View>
                {item.highlights?.length ? (
                  <View style={styles.bullets}>
                    {item.highlights.map((highlight) => (
                      <View key={highlight} style={styles.bulletRow}>
                        <Text style={styles.bulletMark}>•</Text>
                        <Text style={styles.bullet}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {experience.length > 0 ? <View style={styles.separator} /> : null}

        {technologies.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tecnologías</Text>
            <View style={styles.skillsGrid}>
              {technologies.map((group) => (
                <View key={group.title} style={styles.skillGroup}>
                  <Text style={styles.skillGroupTitle}>{group.title}</Text>
                  {group.skills.map((skill) => (
                    <Text key={`${group.title}-${skill.name}`} style={styles.skillItem}>
                      {skill.name} · {skill.level}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {technologies.length > 0 ? <View style={styles.separator} /> : null}

        {projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyectos</Text>
            {projects.map((project) => (
              <View key={project.id} style={styles.projectCard} wrap={false}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                {project.url || project.repoUrl ? (
                  <View style={styles.projectLinks}>
                    {project.url ? (
                      <Link style={styles.projectLink} src={project.url}>
                        {formatUrl(project.url)}
                      </Link>
                    ) : null}
                    {project.repoUrl ? (
                      <Link style={styles.projectLink} src={project.repoUrl}>
                        {formatUrl(project.repoUrl)}
                      </Link>
                    ) : null}
                  </View>
                ) : null}
                {project.tags?.length ? (
                  <View style={styles.projectTags}>
                    <Text style={styles.tag}>{project.tags.join(", ")}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
