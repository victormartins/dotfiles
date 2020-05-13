module Foo
  class Dog
    def initialize(name)
      @name = name
    end

    # Returns the name
    def name
      @name
    end
  end
end

Foo::Dog.new.name


# test finding definition of dog#name
#   :call cursor(14, 14) then gd

# test finding references of dog#name
#   :call cursor(8, 9) then gr

# test moving/selecting inner/outer module/class/method
#   ]m [m vim vam %  var vir  var+ar
