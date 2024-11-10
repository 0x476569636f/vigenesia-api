import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  role: roleEnum("role").notNull().default("USER"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const selectUserSchema = createSelectSchema(users);
export const selectUserSchemaWithoutPassword = createSelectSchema(users).omit({
  password: true,
});
export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(3).max(100),
  email: (schema) => schema.email.email(),
  password: (schema) => schema.password.min(8),
})
  .required({
    name: true,
    email: true,
    password: true,
  })
  .omit({
    id: true,
    role: true,
    created_at: true,
  });

// Tabel Kategori
export const kategori = pgTable("kategori_berita", {
  id: serial("id").primaryKey(),
  namaKategori: varchar("nama_kategori", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Tabel Berita
export const berita = pgTable("berita", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 200 }).notNull(),
  isi: text("isi").notNull(),
  kategoriId: integer("kategori_id")
    .references(() => kategori.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
});

// Motivasi Table
export const motivasi = pgTable("motivasi", {
  id: serial("id").primaryKey(),
  isi_motivasi: text("isi_motivasi").notNull(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Relations
export const kategoriRelations = relations(kategori, ({ many }) => ({
  berita: many(berita),
}));

export const beritaRelations = relations(berita, ({ one }) => ({
  kategori: one(kategori, {
    fields: [berita.kategoriId],
    references: [kategori.id],
  }),
  user: one(users, {
    fields: [berita.userId],
    references: [users.id],
  }),
}));

export const motivasiRelations = relations(motivasi, ({ one }) => ({
  user: one(users, {
    fields: [motivasi.userId],
    references: [users.id],
  }),
}));

// Types
export type Kategori = typeof kategori.$inferSelect;
export type NewKategori = typeof kategori.$inferInsert;

export type Berita = typeof berita.$inferSelect;
export type NewBerita = typeof berita.$inferInsert;

export type Motivasi = typeof motivasi.$inferSelect;
export type NewMotivasi = typeof motivasi.$inferInsert;

export type NewsWithUser = typeof berita.$inferSelect & {
  user: typeof users.$inferSelect | null;
};

export type MotivasiWithUser = typeof motivasi.$inferSelect & {
  user: typeof users.$inferSelect | null;
};
