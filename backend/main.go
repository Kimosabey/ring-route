package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/kimosabey/ring-route/core"
)

var ring = core.NewConsistentHashRing(50)

func init() {
	// Default nodes
	ring.AddNode("worker-01")
	ring.AddNode("worker-02")
	ring.AddNode("worker-03")
}

func main() {
	app := fiber.New(fiber.Config{
		AppName: "RingRoute Go-Fiber Engine",
	})

	app.Use(logger.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, DELETE, OPTIONS, PUT",
	}))

	api := app.Group("/api")

	// Routes
	api.Get("/route", func(c *fiber.Ctx) error {
		key := c.Query("key")
		if key == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Missing 'key' query parameter"})
		}

		target := ring.GetNode(key)
		return c.JSON(fiber.Map{
			"key":       key,
			"routed_to": target,
		})
	})

	api.Post("/nodes/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		ring.AddNode(id)
		return c.JSON(fiber.Map{
			"message":       "Node " + id + " added",
			"topology_size": len(ring.GetTopology()),
		})
	})

	api.Delete("/nodes/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		ring.RemoveNode(id)
		return c.JSON(fiber.Map{
			"message": "Node " + id + " removed",
		})
	})

	api.Get("/topology", func(c *fiber.Ctx) error {
		return c.JSON(ring.GetTopology())
	})

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("RingRoute Go Backend is Healthy")
	})

	log.Fatal(app.Listen(":3002"))
}
