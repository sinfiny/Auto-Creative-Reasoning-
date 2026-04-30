defmodule AutoWriter.MixProject do
  use Mix.Project

  def project do
    [
      app: :auto_writer,
      version: "0.1.0",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      test_paths: ["lab/test"],
      deps: []
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end
end
